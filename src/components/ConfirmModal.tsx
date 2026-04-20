import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function ConfirmModal({ 
  open, 
  onOpenChange, 
  title, 
  description, 
  onConfirm, 
  confirmText = "Confirm",
  cancelText = "Cancel",
  destructive = false
}: { 
  open: boolean, 
  onOpenChange: (open: boolean) => void, 
  title: string, 
  description: string, 
  onConfirm: () => void | Promise<any>,
  confirmText?: string,
  cancelText?: string,
  destructive?: boolean
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-[400px] rounded-3xl border-2 ${destructive ? 'border-red-100' : 'border-[#5a8c12]/20'}`}>
        <DialogHeader>
          <DialogTitle className={`text-xl font-black ${destructive ? 'text-red-600' : 'text-slate-800'}`}>{title}</DialogTitle>
        </DialogHeader>
        <p className="text-slate-600 font-medium text-sm leading-relaxed">{description}</p>
        <DialogFooter className="pt-4 gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl border-slate-200 hover:bg-slate-50 text-slate-600 font-bold">{cancelText}</Button>
          <Button 
            onClick={async () => { 
              await onConfirm(); 
              onOpenChange(false);
            }} 
            className={`rounded-xl text-white font-black shadow-lg transition-all active:scale-95 ${
              destructive 
                ? 'bg-red-600 hover:bg-red-700 shadow-red-200' 
                : 'bg-[#5a8c12] hover:bg-[#4a730f] shadow-[#5a8c12]/20'
            }`}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
