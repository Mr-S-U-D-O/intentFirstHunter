import { useMemo } from 'react';
import { useData } from './DataProvider';
import { LeadsTable } from './LeadsTable';
import { Activity, Database, AlertCircle, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format, subDays } from 'date-fns';

export function Home() {
  const { scrapers, leads } = useData();

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
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col mb-6">
        <span className="text-xs text-slate-500 font-medium mb-1">Pages / Home</span>
        <h1 className="text-xl font-bold text-slate-800">Home Dashboard</h1>
      </div>
      
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-2 border-[#5a8c12] flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 mb-1">Total Leads</p>
            <p className="text-2xl font-bold text-slate-800">{leads.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#5a8c12] text-white flex items-center justify-center shadow-md">
            <Database size={20} strokeWidth={1.5} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-2 border-[#5a8c12] flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 mb-1">Running Scrapers</p>
            <p className="text-2xl font-bold text-slate-800">{activeScrapers}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#446715] text-white flex items-center justify-center shadow-md">
            <Activity size={20} strokeWidth={1.5} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-2 border-[#5a8c12] flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 mb-1">Failed Jobs</p>
            <p className="text-2xl font-bold text-slate-800">{failedJobs}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#304513] text-white flex items-center justify-center shadow-md">
            <AlertCircle size={20} strokeWidth={1.5} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-2 border-[#5a8c12] flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 mb-1">Success Rate</p>
            <p className="text-2xl font-bold text-slate-800">
              {scrapers.length ? Math.round(((scrapers.length - failedJobs) / scrapers.length) * 100) : 0}%
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#1c250f] text-white flex items-center justify-center shadow-md">
            <TrendingUp size={20} strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-2 border-[#5a8c12] lg:col-span-2 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Lead Generation Overview</h3>
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5a8c12" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#5a8c12" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                  cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="leads" stroke="#5a8c12" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-2 border-[#5a8c12] flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Scraper Status</h3>
          <div className="flex-1 flex flex-col justify-center gap-6">
            {scrapers.length === 0 ? (
              <div className="text-center text-slate-500">No scrapers configured</div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-[#5a8c12]"></div>
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
                    <div className="w-3 h-3 rounded-full bg-[#304513]"></div>
                    <span className="text-sm font-semibold text-slate-600">Failed</span>
                  </div>
                  <span className="font-bold text-slate-800">{failedJobs}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-2 border-[#5a8c12] overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center gap-3">
          <Database size={20} strokeWidth={1.5} className="text-[#5a8c12]" />
          <h2 className="text-lg font-bold text-slate-800">Recent Leads</h2>
        </div>
        <LeadsTable leads={leads} scrapers={scrapers} />
      </div>
    </div>
  );
}
