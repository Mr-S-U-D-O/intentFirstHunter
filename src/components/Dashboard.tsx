import { useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthProvider';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Scraper, Lead } from '../types';
import { Sidebar } from './Sidebar';
import { LeadsTable } from './LeadsTable';
import { AddScraperModal } from './AddScraperModal';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, Activity, Database, AlertCircle, TrendingUp, Settings, User as UserIcon, LogOut } from 'lucide-react';
import { useScraperEngine } from '../hooks/useScraperEngine';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format, subDays } from 'date-fns';

export default function Dashboard() {
  const { user, logOut } = useAuth();
  const [scrapers, setScrapers] = useState<Scraper[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) return;

    const scrapersQuery = query(collection(db, 'scrapers'), where('userId', '==', user.uid));
    const unsubscribeScrapers = onSnapshot(scrapersQuery, (snapshot) => {
      const data: Scraper[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Scraper);
      });
      setScrapers(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'scrapers');
    });

    const leadsQuery = query(collection(db, 'leads'), where('userId', '==', user.uid));
    const unsubscribeLeads = onSnapshot(leadsQuery, (snapshot) => {
      const data: Lead[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Lead);
      });
      // Sort by createdAt descending locally since we didn't create an index yet
      data.sort((a, b) => {
        const timeA = a.createdAt?.toMillis?.() || 0;
        const timeB = b.createdAt?.toMillis?.() || 0;
        return timeB - timeA;
      });
      setLeads(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'leads');
    });

    return () => {
      unsubscribeScrapers();
      unsubscribeLeads();
    };
  }, [user]);

  // Start the engine that runs active scrapers
  useScraperEngine(scrapers);

  // Process chart data
  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = subDays(new Date(), 6 - i);
      return {
        date: format(d, 'MMM dd'),
        leads: 0,
        rawDate: d
      };
    });

    leads.forEach(lead => {
      if (!lead.createdAt) return;
      const leadDate = new Date(lead.createdAt.toMillis());
      const formatted = format(leadDate, 'MMM dd');
      const day = last7Days.find(d => d.date === formatted);
      if (day) {
        day.leads += 1;
      }
    });

    return last7Days;
  }, [leads]);

  const activeScrapers = scrapers.filter(s => s.status === 'active').length;
  // Mock failed jobs for analytics display
  const failedJobs = Math.floor(scrapers.length * 0.1); 

  return (
    <div className="flex h-screen bg-[#f8f9fa] font-sans text-slate-900 p-4 gap-6">
      <Sidebar scrapers={scrapers} onAddScraper={() => setIsAddModalOpen(true)} />
      
      <main className="flex-1 flex flex-col overflow-hidden bg-transparent">
        <header className="h-16 flex items-center justify-between px-2 shrink-0 mb-4">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium mb-1">Pages / Home</span>
            <h1 className="text-xl font-bold text-slate-800">Home Dashboard</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search leads or scrapers..." 
                className="pl-9 bg-white border-none shadow-sm rounded-xl h-10 focus-visible:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Avatar className="h-10 w-10 border-2 border-white shadow-sm cursor-pointer hover:opacity-90 transition-opacity">
                  <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} />
                  <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                    {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.displayName || 'User'}</p>
                    <p className="text-xs leading-none text-slate-500">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer gap-2">
                  <UserIcon size={14} /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer gap-2">
                  <Settings size={14} /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logOut} className="cursor-pointer gap-2 text-red-600 focus:text-red-600">
                  <LogOut size={14} /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto pb-4 px-2">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-0 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500 mb-1">Total Leads</p>
                  <p className="text-2xl font-bold text-slate-800">{leads.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-md">
                  <Database size={20} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-0 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500 mb-1">Running Scrapers</p>
                  <p className="text-2xl font-bold text-slate-800">{activeScrapers}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-500 text-white flex items-center justify-center shadow-md">
                  <Activity size={20} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-0 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500 mb-1">Failed Jobs</p>
                  <p className="text-2xl font-bold text-slate-800">{failedJobs}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400 to-red-500 text-white flex items-center justify-center shadow-md">
                  <AlertCircle size={20} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-0 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500 mb-1">Success Rate</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {scrapers.length ? Math.round(((scrapers.length - failedJobs) / scrapers.length) * 100) : 0}%
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center shadow-md">
                  <TrendingUp size={20} />
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-0 lg:col-span-2 flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Lead Generation Overview</h3>
                <div className="flex-1 min-h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                        cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                      />
                      <Area type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-0 flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Scraper Status</h3>
                <div className="flex-1 flex flex-col justify-center gap-6">
                  {scrapers.length === 0 ? (
                    <div className="text-center text-slate-500">No scrapers configured</div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                          <span className="text-sm font-semibold text-slate-600">Active</span>
                        </div>
                        <span className="font-bold text-slate-800">{activeScrapers}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                          <span className="text-sm font-semibold text-slate-600">Paused</span>
                        </div>
                        <span className="font-bold text-slate-800">{scrapers.length - activeScrapers - failedJobs}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <span className="text-sm font-semibold text-slate-600">Failed</span>
                        </div>
                        <span className="font-bold text-slate-800">{failedJobs}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-0 overflow-hidden">
              <div className="p-6 border-b border-slate-50">
                <h2 className="text-lg font-bold text-slate-800">Recent Leads</h2>
              </div>
              <LeadsTable leads={leads} scrapers={scrapers} />
            </div>
          </div>
        </div>
      </main>

      <AddScraperModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
    </div>
  );
}
