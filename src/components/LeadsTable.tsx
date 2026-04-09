import { Lead, Scraper } from '../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink } from 'lucide-react';

export function LeadsTable({ leads, scrapers }: { leads: Lead[], scrapers: Scraper[] }) {
  if (leads.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500">
        No leads found yet. Add an active scraper and wait for it to find matches.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-slate-50/50">
          <TableHead className="w-[200px]">Post Title</TableHead>
          <TableHead>Subreddit</TableHead>
          <TableHead>Keyword Matched</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Found</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((lead) => {
          const scraper = scrapers.find(s => s.id === lead.scraperId);
          const timeAgo = lead.createdAt?.toMillis 
            ? formatDistanceToNow(lead.createdAt.toMillis(), { addSuffix: true }) 
            : 'Just now';

          return (
            <TableRow key={lead.id}>
              <TableCell className="font-medium max-w-[200px] truncate" title={lead.postTitle}>
                {lead.postTitle}
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-[#5a8c12]/10 text-[#446715] text-xs font-medium">
                  r/{lead.subreddit}
                </span>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-[#304513]/10 text-[#304513] text-xs font-medium">
                  "{lead.keyword}"
                </span>
              </TableCell>
              <TableCell className="text-slate-500 text-sm">u/{lead.postAuthor}</TableCell>
              <TableCell className="text-slate-500 text-sm">{timeAgo}</TableCell>
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
  );
}
