import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function ConfirmModal({ 
  open, 
  onOpenChange, 
  title, 
  description, 
  onConfirm, 
  confirmText = "Confirm",
  cancelText = "Cancel"
}: { 
  open: boolean, 
  onOpenChange: (open: boolean) => void, 
  title: string, 
  description: string, 
  onConfirm: () => void,
  confirmText?: string,
  cancelText?: string
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] rounded-2xl border-2 border-[#5a8c12]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">{title}</DialogTitle>
        </DialogHeader>
        <p className="text-slate-600">{description}</p>
        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl border-slate-200 hover:bg-slate-50">{cancelText}</Button>
          <Button onClick={() => { onConfirm(); onOpenChange(false); }} className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md">{confirmText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
