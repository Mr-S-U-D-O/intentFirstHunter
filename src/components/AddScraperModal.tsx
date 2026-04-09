import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from './AuthProvider';
import { useData } from './DataProvider';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Plus, AlertCircle } from 'lucide-react';

export function AddScraperModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { user } = useAuth();
  const { scrapers } = useData();
  const [name, setName] = useState('');
  const [subreddit, setSubreddit] = useState('');
  const [keyword, setKeyword] = useState('');
  const [interval, setInterval] = useState('15');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    // Check for duplicate name
    if (scrapers.some(s => s.name.toLowerCase() === name.trim().toLowerCase())) {
      setError('A scraper with this name already exists.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const newScraperRef = doc(collection(db, 'scrapers'));
      await setDoc(newScraperRef, {
        name: name.trim(),
        subreddit: subreddit.replace(/^r\//, ''), // Remove r/ if user typed it
        keyword,
        intervalMinutes: parseInt(interval, 10),
        status: 'active',
        createdAt: serverTimestamp(),
        userId: user.uid
      });
      
      onOpenChange(false);
      // Reset form
      setName('');
      setSubreddit('');
      setKeyword('');
      setInterval('15');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'scrapers');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl border-2 border-[#5a8c12]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">Add New Scraper</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-700 font-semibold">Scraper Name</Label>
            <Input 
              id="name" 
              placeholder="e.g. SaaS Founders" 
              value={name} 
              onChange={(e) => { setName(e.target.value); setError(null); }} 
              required 
              className="rounded-xl border-slate-200 focus-visible:ring-[#5a8c12]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subreddit" className="text-slate-700 font-semibold">Target Subreddit</Label>
            <div className="flex items-center">
              <span className="bg-slate-100 border border-r-0 border-slate-200 px-3 py-2 rounded-l-xl text-slate-500 text-sm font-medium h-10 flex items-center">r/</span>
              <Input 
                id="subreddit" 
                placeholder="Entrepreneur" 
                className="rounded-l-none rounded-r-xl border-slate-200 focus-visible:ring-[#5a8c12]"
                value={subreddit} 
                onChange={(e) => setSubreddit(e.target.value)} 
                required 
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="keyword" className="text-slate-700 font-semibold">Keyword to look for</Label>
            <Input 
              id="keyword" 
              placeholder="e.g. looking for a tool" 
              value={keyword} 
              onChange={(e) => setKeyword(e.target.value)} 
              required 
              className="rounded-xl border-slate-200 focus-visible:ring-[#5a8c12]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interval" className="text-slate-700 font-semibold">Run Interval</Label>
            <Select value={interval} onValueChange={setInterval}>
              <SelectTrigger className="rounded-xl border-slate-200 focus:ring-[#5a8c12]">
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-[#5a8c12]">
                <SelectItem value="5">Every 5 minutes</SelectItem>
                <SelectItem value="15">Every 15 minutes</SelectItem>
                <SelectItem value="30">Every 30 minutes</SelectItem>
                <SelectItem value="60">Every 1 hour</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl border-slate-200 hover:bg-slate-50">Cancel</Button>
            <Button type="submit" disabled={loading} className="rounded-xl bg-[#5a8c12] hover:bg-[#446715] text-white font-semibold shadow-md gap-2">
              <Plus size={16} strokeWidth={1.5} />
              {loading ? 'Deploying...' : 'Deploy Scraper'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
