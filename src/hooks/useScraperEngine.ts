import { useEffect, useRef } from 'react';
import { Scraper } from '../types';
import { collection, doc, setDoc, getDocs, query, where, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../components/AuthProvider';

export function useScraperEngine(scrapers: Scraper[]) {
  const { user } = useAuth();
  // Keep track of which scrapers are currently running to avoid overlapping runs
  const runningRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;

    const runScraper = async (scraper: Scraper) => {
      if (runningRef.current.has(scraper.id)) return;
      runningRef.current.add(scraper.id);

      try {
        console.log(`Running scraper: ${scraper.name} for r/${scraper.subreddit}`);
        
        // Fetch from local API proxy
        const response = await fetch(`/api/reddit/${scraper.subreddit}`);
        if (!response.ok) {
          throw new Error(`Reddit API returned ${response.status}`);
        }
        
        const data = await response.json();
        const posts = data.data?.children || [];
        
        const keywordLower = scraper.keyword.toLowerCase();
        
        for (const post of posts) {
          const postData = post.data;
          const title = postData.title || '';
          const selftext = postData.selftext || '';
          
          // Check if keyword matches title or content
          if (title.toLowerCase().includes(keywordLower) || selftext.toLowerCase().includes(keywordLower)) {
            
            // Check if we already have this lead to avoid duplicates
            // In a real app, we'd query by postUrl or a unique post ID.
            const leadsRef = collection(db, 'leads');
            const q = query(
              leadsRef, 
              where('scraperId', '==', scraper.id),
              where('postUrl', '==', `https://www.reddit.com${postData.permalink}`)
            );
            
            const existingDocs = await getDocs(q);
            
            if (existingDocs.empty) {
              // Save new lead
              const newLeadRef = doc(collection(db, 'leads'));
              await setDoc(newLeadRef, {
                scraperId: scraper.id,
                subreddit: scraper.subreddit,
                keyword: scraper.keyword,
                postTitle: title,
                postUrl: `https://www.reddit.com${postData.permalink}`,
                postAuthor: postData.author,
                postContent: selftext.substring(0, 10000), // Limit size
                createdAt: serverTimestamp(),
                userId: user.uid
              });
              console.log(`Found new lead in r/${scraper.subreddit}: ${title}`);
            }
          }
        }
        
        // Update lastRunAt
        const scraperRef = doc(db, 'scrapers', scraper.id);
        await updateDoc(scraperRef, {
          lastRunAt: serverTimestamp()
        });
        
      } catch (error) {
        console.error(`Error running scraper ${scraper.name}:`, error);
      } finally {
        runningRef.current.delete(scraper.id);
      }
    };

    // Set up intervals for active scrapers
    const intervals: Record<string, NodeJS.Timeout> = {};

    scrapers.forEach(scraper => {
      if (scraper.status === 'active') {
        // Run immediately on mount/activation if it hasn't run recently
        // For simplicity in this demo, we'll just run it once immediately, then set interval
        runScraper(scraper);
        
        // Convert minutes to milliseconds
        const intervalMs = scraper.intervalMinutes * 60 * 1000;
        intervals[scraper.id] = setInterval(() => runScraper(scraper), intervalMs);
      }
    });

    return () => {
      // Cleanup intervals on unmount or when scrapers change
      Object.values(intervals).forEach(clearInterval);
    };
  }, [scrapers, user]);
}
