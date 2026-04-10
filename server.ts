import express from "express";
import * as dotenv from "dotenv";
dotenv.config();

import { createServer as createViteServer } from "vite";
import path from "path";
import { readFileSync } from 'fs';
import { GoogleGenAI } from '@google/genai';
import { initializeApp, getApps, getApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Load config safely
const firebaseConfig = JSON.parse(
  readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf8')
);

// Set environment variables to force the correct project ID for Admin SDK
if (firebaseConfig.projectId) {
  process.env.GOOGLE_CLOUD_PROJECT = firebaseConfig.projectId;
  process.env.GCLOUD_PROJECT = firebaseConfig.projectId;
}

// Initialize Firebase Admin (for background tasks to bypass rules)
console.log("[Firebase Admin] Initializing...");
try {
  if (!getApps().length) {
    // In Cloud Run, initializeApp() without arguments is the most reliable
    // way to pick up the service account credentials automatically.
    initializeApp();
    console.log("[Firebase Admin] Initialized with default application credentials");
  }
} catch (e) {
  console.error("[Firebase Admin] Critical Init failed:", e);
}

const databaseId = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)' 
  ? firebaseConfig.firestoreDatabaseId 
  : undefined;

console.log("[Firebase Admin] Using Database ID:", databaseId || "(default)");

let adminDb: any;
try {
  // Use the default app's firestore
  const app = getApp();
  adminDb = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
  console.log(`[Firebase Admin] Firestore instance created for database: ${databaseId || "(default)"}`);
  
    // Test connection immediately
    adminDb.collection('health_check').limit(1).get()
      .then(() => console.log("[Firebase Admin] Connection test successful"))
      .catch((err: any) => {
        console.error("[Firebase Admin] Connection test failed with error code:", err.code);
        console.error("[Firebase Admin] Connection test failed with message:", err.message);
        if (err.stack) console.error("[Firebase Admin] Stack trace:", err.stack);
      });

} catch (e) {
  console.error("[Firebase Admin] Firestore critical init failed:", e);
}

// Initialize AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/reddit/:subreddit", async (req, res) => {
    try {
      const { subreddit } = req.params;
      
      if (!subreddit || subreddit.trim() === "") {
        return res.status(400).json({ error: "Subreddit name is required" });
      }

      // Use RSS feed via rss2json to bypass Reddit's strict IP blocking
      const rssUrl = encodeURIComponent(`https://www.reddit.com/r/${subreddit.trim()}/new.rss`);
      
      const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`);
      
      const responseText = await response.text();
      
      if (!response.ok) {
        console.error(`RSS API Error (${response.status}):`, responseText);
        return res.status(response.status).json({ 
          error: `RSS Service Error: ${response.status}`,
          details: responseText 
        });
      }
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse RSS API response as JSON:", responseText.substring(0, 500));
        return res.status(500).json({ error: "RSS Service returned invalid JSON", details: responseText.substring(0, 200) });
      }
      
      if (data.status !== 'ok') {
        console.error("RSS2JSON returned non-ok status:", data);
        return res.status(500).json({ 
          error: "Failed to parse RSS feed", 
          details: data.message || "Unknown RSS error" 
        });
      }
      
      const items = data.items || [];
      
      // Map the RSS output to match the exact frontend data structure
      const mappedPosts = items.map((item: any, index: number) => {
        let permalink = item.link || '';
        try {
          permalink = new URL(item.link).pathname;
        } catch (e) {
          permalink = permalink.replace('https://www.reddit.com', '');
        }
        
        const rawContent = item.content || item.description || '';
        
        return {
          data: {
            index,
            title: item.title || '',
            selftext: rawContent.replace(/<[^>]*>?/gm, ''),
            author: (item.author || '').replace('/u/', ''),
            permalink: permalink,
            pubDate: item.pubDate
          }
        };
      });
      
      // Only process posts from the last 48 hours to ensure they are "recent"
      const fortyEightHoursAgo = Date.now() - (48 * 60 * 60 * 1000);
      const recentPosts = mappedPosts.filter((post: any) => {
        const postDate = new Date(post.data.pubDate).getTime();
        return postDate > fortyEightHoursAgo;
      });

      return res.json(recentPosts);
    } catch (error) {
      console.error("Error fetching from RSS API:", error);
      res.status(500).json({ error: "Failed to fetch from RSS" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    
    // Start background scraper engine
    console.log("Starting background scraper engine...");
    setInterval(runBackgroundScrapers, 60 * 1000); // Check every minute
    setTimeout(runBackgroundScrapers, 10000); // Run once after 10 seconds to allow server to fully start
  });
}

// Background Scraper Logic
async function runBackgroundScrapers() {
  try {
    console.log(`[Background Engine] Checking for scrapers to run... ${new Date().toISOString()}`);
    const scrapersRef = adminDb.collection('scrapers');
    const querySnapshot = await scrapersRef.where('status', '==', 'active').get();
    
    for (const scraperDoc of querySnapshot.docs) {
      const scraper = { id: scraperDoc.id, ...scraperDoc.data() } as any;
      const lastRun = scraper.lastRunAt?.toMillis?.() || scraper.createdAt?.toMillis?.() || 0;
      const nextRun = lastRun + (scraper.intervalMinutes * 60 * 1000);
      
      if (Date.now() >= nextRun) {
        console.log(`[Background Engine] Running scraper: ${scraper.name} (r/${scraper.subreddit})`);
        await executeScraper(scraper);
      }
    }
  } catch (error) {
    console.error("[Background Engine] Error in background loop:", error);
  }
}

async function executeScraper(scraper: any) {
  try {
    const response = await fetch(`http://localhost:3000/api/reddit/${scraper.subreddit}`);
    
    const text = await response.text();
    let rawPosts;
    try {
      rawPosts = JSON.parse(text);
    } catch (e) {
      console.error(`[Background Engine] Failed to parse JSON for scraper ${scraper.name}. Response: ${text.substring(0, 200)}...`);
      throw new Error(`Invalid JSON response from API: ${response.status}`);
    }

    if (!response.ok) throw new Error(`Reddit API failed: ${response.status} - ${JSON.stringify(rawPosts)}`);
    
    if (!rawPosts || rawPosts.length === 0) return;

    const keywordLower = scraper.keyword.toLowerCase();
    
    // AI Scoring
    const minimizedData = rawPosts.map((post: any) => ({
      index: post.data.index,
      title: post.data.title,
      content: post.data.selftext.substring(0, 800)
    }));

    const prompt = `You are an expert lead generation analyst. I am providing a JSON array of ${minimizedData.length} recent social media posts. 
    
    YOUR SPECIFIC TARGET: ${scraper.leadDefinition || 'General commercial intent'}
    
    Evaluate EACH AND EVERY post based on this target definition. 
    
    CRITICAL: You MUST return a score for EVERY post in the input array. Do not skip any.
    
    Score the intent from 1 to 10:
    - 1-3: No match to the target definition.
    - 4-6: Partial match or vague interest.
    - 7-10: Perfect match. The user is explicitly asking for exactly what is described in the target definition.
    
    Return ONLY a valid JSON array of objects. 
    Format: [{ "index": number, "score": number, "reason": "string", "isLead": boolean }]
    
    Input Data:
    ${JSON.stringify(minimizedData)}`;

    const aiResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    const responseText = aiResponse.text || '[]';
    const cleanedText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const scoredData = JSON.parse(cleanedText);

    let newLeadsCount = 0;
    for (const scoreObj of scoredData) {
      const post = rawPosts.find((p: any) => p.data.index === scoreObj.index);
      if (!post) continue;

      const title = post.data.title || '';
      const selftext = post.data.selftext || '';
      const hasKeyword = title.toLowerCase().includes(keywordLower) || selftext.toLowerCase().includes(keywordLower);
      const isAiLead = scoreObj.isLead === true || scoreObj.score >= 7;

      if (hasKeyword || isAiLead) {
        const postUrl = `https://www.reddit.com${post.data.permalink}`;
        
        // Check if lead exists
        const leadsRef = adminDb.collection('leads');
        const existingLeads = await leadsRef
          .where('scraperId', '==', scraper.id)
          .where('postUrl', '==', postUrl)
          .get();
        
        if (existingLeads.empty) {
          await adminDb.collection('leads').add({
            scraperId: scraper.id,
            subreddit: scraper.subreddit,
            keyword: scraper.keyword,
            postTitle: title,
            postUrl: postUrl,
            postAuthor: post.data.author || 'unknown',
            postContent: selftext.substring(0, 10000),
            score: scoreObj.score,
            reason: scoreObj.reason,
            createdAt: FieldValue.serverTimestamp(),
            userId: scraper.userId
          });
          newLeadsCount++;
        }
      }
    }

    // Update lastRunAt
    await adminDb.collection('scrapers').doc(scraper.id).update({
      lastRunAt: FieldValue.serverTimestamp()
    });

    // Log completion
    await adminDb.collection('logs').add({
      type: 'scraper_run',
      scraperId: scraper.id,
      scraperName: scraper.name,
      message: `Background scan completed. Found ${newLeadsCount} new leads.`,
      createdAt: FieldValue.serverTimestamp(),
      userId: scraper.userId
    });

  } catch (error) {
    console.error(`[Background Engine] Error running scraper ${scraper.name}:`, error);
  }
}

startServer();
