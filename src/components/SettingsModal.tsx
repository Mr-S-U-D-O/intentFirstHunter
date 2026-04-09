import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Bell, Moon, Download, Shield } from 'lucide-react';

export function SettingsModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl border-2 border-[#5a8c12]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Preferences</h4>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#5a8c12]/10 text-[#5a8c12] flex items-center justify-center">
                  <Bell size={16} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-semibold text-slate-700 text-sm">Email Notifications</p>
                  <p className="text-xs text-slate-500">Receive alerts for new leads</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#5a8c12]/10 text-[#5a8c12] flex items-center justify-center">
                  <Moon size={16} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-semibold text-slate-700 text-sm">Dark Mode</p>
                  <p className="text-xs text-slate-500">Toggle dark theme</p>
                </div>
              </div>
              <Switch />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Data & Privacy</h4>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#5a8c12]/10 text-[#5a8c12] flex items-center justify-center">
                  <Download size={16} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-semibold text-slate-700 text-sm">Export Data</p>
                  <p className="text-xs text-slate-500">Download all your leads as CSV</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-2 border-[#5a8c12] text-[#5a8c12] hover:bg-[#5a8c12] hover:text-white rounded-lg transition-colors">Export</Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#5a8c12]/10 text-[#5a8c12] flex items-center justify-center">
                  <Shield size={16} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-semibold text-slate-700 text-sm">Privacy Policy</p>
                  <p className="text-xs text-slate-500">Review our data policies</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-800 rounded-lg">View</Button>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
