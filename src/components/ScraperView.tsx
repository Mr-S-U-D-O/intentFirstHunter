import { useParams, useNavigate } from 'react-router-dom';
import { useData } from './DataProvider';
import { format } from 'date-fns';
import { ExternalLink, Activity, PauseCircle, Trash2, RefreshCw, Database } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { doc, deleteDoc, collection, query, where, getDocs, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { ConfirmModal } from './ConfirmModal';

export function ScraperView() {
  const { id } = useParams<{ id: string }>();
  const { scrapers, leads } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isRetrying, setIsRetrying] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const scraper = scrapers.find(s => s.id === id);
  const scraperLeads = leads.filter(l => l.scraperId === id);

  if (!scraper) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        Scraper not found or loading...
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'scrapers', scraper.id));
      navigate('/');
    } catch (error) {
      console.error('Error deleting scraper:', error);
    }
  };

  const handleRetry = async () => {
    if (!user) return;
    setIsRetrying(true);
    try {
      const rssUrl = encodeURIComponent(`https://www.reddit.com/r/${scraper.subreddit}/new.rss`);
      const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`);
      
      if (!response.ok) throw new Error('Failed to fetch from RSS API');
      
      const data = await response.json();
      const posts = data.items || [];
      const keywordLower = scraper.keyword.toLowerCase();
      
      let newLeadsCount = 0;

      for (const post of posts) {
        const title = post.title || '';
        const selftext = (post.content || '').replace(/<[^>]*>?/gm, '');
        
        if (title.toLowerCase().includes(keywordLower) || selftext.toLowerCase().includes(keywordLower)) {
          const leadsRef = collection(db, 'leads');
          const q = query(
            leadsRef, 
            where('scraperId', '==', scraper.id),
            where('postUrl', '==', post.link)
          );
          
          const existingDocs = await getDocs(q);
          
          if (existingDocs.empty) {
            const newLeadRef = doc(collection(db, 'leads'));
            await setDoc(newLeadRef, {
              scraperId: scraper.id,
              subreddit: scraper.subreddit,
              keyword: scraper.keyword,
              postTitle: title,
              postUrl: post.link,
              postAuthor: (post.author || '').replace('/u/', ''),
              postContent: selftext.substring(0, 10000),
              createdAt: serverTimestamp(),
              userId: user.uid
            });
            newLeadsCount++;
          }
        }
      }

      await updateDoc(doc(db, 'scrapers', scraper.id), {
        lastRunAt: serverTimestamp()
      });

      console.log(`Retry complete. Found ${newLeadsCount} new leads.`);
    } catch (error) {
      console.error('Error retrying scraper:', error);
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col mb-6">
        <span className="text-xs text-slate-500 font-medium mb-1">Pages / Scrapers / {scraper.name}</span>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-slate-800">{scraper.name}</h1>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${scraper.status === 'active' ? 'bg-[#5a8c12]/10 text-[#5a8c12]' : 'bg-slate-100 text-slate-600'}`}>
              {scraper.status === 'active' ? <Activity size={14} strokeWidth={1.5} /> : <PauseCircle size={14} strokeWidth={1.5} />}
              {scraper.status.toUpperCase()}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleRetry} 
              disabled={isRetrying}
              variant="outline" 
              className="gap-2 border-2 border-[#5a8c12] text-[#5a8c12] hover:bg-[#5a8c12] hover:text-white transition-colors rounded-xl"
            >
              <RefreshCw size={16} strokeWidth={1.5} className={isRetrying ? 'animate-spin' : ''} />
              {isRetrying ? 'Running...' : 'Force Run'}
            </Button>
            <Button 
              onClick={() => setIsDeleteModalOpen(true)} 
              variant="destructive" 
              className="gap-2 rounded-xl"
            >
              <Trash2 size={16} strokeWidth={1.5} />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-2 border-[#5a8c12]">
          <p className="text-sm font-semibold text-slate-500 mb-1">Target Subreddit</p>
          <p className="text-xl font-bold text-slate-800">r/{scraper.subreddit}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-2 border-[#5a8c12]">
          <p className="text-sm font-semibold text-slate-500 mb-1">Target Keyword</p>
          <p className="text-xl font-bold text-slate-800">"{scraper.keyword}"</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-2 border-[#5a8c12]">
          <p className="text-sm font-semibold text-slate-500 mb-1">Total Leads Found</p>
          <p className="text-xl font-bold text-slate-800">{scraperLeads.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-2 border-[#5a8c12] overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center gap-3">
          <Database size={20} strokeWidth={1.5} className="text-[#5a8c12]" />
          <h2 className="text-lg font-bold text-slate-800">Generated Leads Database</h2>
        </div>
        
        {scraperLeads.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No leads generated yet for this scraper.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="w-[120px]">Date</TableHead>
                <TableHead className="w-[100px]">Time</TableHead>
                <TableHead className="w-[150px]">User</TableHead>
                <TableHead>Post Title & Content</TableHead>
                <TableHead className="text-right w-[100px]">Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scraperLeads.map((lead) => {
                const dateObj = lead.createdAt?.toMillis ? new Date(lead.createdAt.toMillis()) : new Date();
                
                return (
                  <TableRow key={lead.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-medium text-slate-700">
                      {format(dateObj, 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {format(dateObj, 'HH:mm')}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                        u/{lead.postAuthor}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 max-w-[500px]">
                        <span className="font-semibold text-slate-800 truncate" title={lead.postTitle}>
                          {lead.postTitle}
                        </span>
                        {lead.postContent && (
                          <span className="text-xs text-slate-500 line-clamp-2" title={lead.postContent}>
                            {lead.postContent}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <a 
                        href={lead.postUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#5a8c12]/10 text-[#5a8c12] transition-colors"
                        title="View on Reddit"
                      >
                        <ExternalLink size={16} strokeWidth={1.5} />
                      </a>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
      <ConfirmModal 
        open={isDeleteModalOpen} 
        onOpenChange={setIsDeleteModalOpen} 
        title="Delete Scraper"
        description="Are you sure you want to delete this scraper? All associated leads will remain."
        onConfirm={handleDelete}
        confirmText="Delete"
      />
    </div>
  );
}
