import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

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
      // Use rss2json to bypass Reddit's aggressive IP blocking for cloud servers
      const rssUrl = encodeURIComponent(`https://www.reddit.com/r/${subreddit}/new.rss`);
      const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`);
      
      if (!response.ok) {
        return res.status(response.status).json({ error: `RSS API returned ${response.status}` });
      }
      
      const data = await response.json();
      
      // Transform RSS JSON format to match the expected Reddit JSON format
      // so we don't have to rewrite the frontend scraper engine
      const transformedData = {
        data: {
          children: (data.items || []).map((item: any) => ({
            data: {
              title: item.title,
              selftext: item.content.replace(/<[^>]*>?/gm, ''), // Strip HTML tags
              author: item.author.replace('/u/', ''),
              permalink: item.link.replace('https://www.reddit.com', '')
            }
          }))
        }
      };
      
      res.json(transformedData);
    } catch (error) {
      console.error("Error fetching from Reddit RSS:", error);
      res.status(500).json({ error: "Failed to fetch from Reddit" });
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
  });
}

startServer();
