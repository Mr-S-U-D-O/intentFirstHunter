import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from './AuthProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function ProfileModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { user } = useAuth();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl border-2 border-[#5a8c12]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">User Profile</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-6">
          <Avatar className="h-24 w-24 border-4 border-[#5a8c12] shadow-md">
            <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} />
            <AvatarFallback className="bg-[#5a8c12]/10 text-[#5a8c12] text-2xl font-bold">
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="text-center space-y-1">
            <h3 className="text-xl font-bold text-slate-800">{user?.displayName || 'Unknown User'}</h3>
            <p className="text-slate-500">{user?.email}</p>
          </div>
          <div className="w-full pt-4 space-y-3">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-sm font-semibold text-slate-500">Account ID</span>
              <span className="text-sm font-mono text-slate-700 truncate max-w-[200px]">{user?.uid}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-sm font-semibold text-slate-500">Email Verified</span>
              <span className="text-sm font-medium text-slate-700">{user?.emailVerified ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
