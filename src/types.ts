export interface Scraper {
  id: string;
  name: string;
  subreddit: string;
  keyword: string;
  intervalMinutes: number;
  status: 'active' | 'paused';
  createdAt: any;
  lastRunAt?: any;
  userId: string;
}

export interface Lead {
  id: string;
  scraperId: string;
  subreddit: string;
  keyword: string;
  postTitle: string;
  postUrl: string;
  postAuthor: string;
  postContent?: string;
  createdAt: any;
  userId: string;
}
