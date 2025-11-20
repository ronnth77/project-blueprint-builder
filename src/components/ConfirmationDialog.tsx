import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Habit } from '@/types';

interface ConfirmationDialogProps {
  isOpen: boolean;
  habit: Habit;
  onConfirm: (avoided: boolean) => void;
}

const ConfirmationDialog = ({ isOpen, habit, onConfirm }: ConfirmationDialogProps) => {
  const handleYes = () => {
    onConfirm(true); // User avoided the habit
  };

  const handleNo = () => {
    onConfirm(false); // User gave in
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}} modal={true}>
      <DialogContent 
        className="sm:max-w-md [&>button]:hidden"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl">End of Day Confirmation</DialogTitle>
          <DialogDescription className="text-base pt-2">
            Did you avoid <strong>{habit.name}</strong> today?
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex gap-3 sm:justify-center mt-4">
          <Button
            onClick={handleYes}
            className="flex-1 sm:flex-initial min-w-[100px]"
            variant="default"
          >
            Yes, I Avoided It
          </Button>
          <Button
            onClick={handleNo}
            className="flex-1 sm:flex-initial min-w-[100px]"
            variant="destructive"
          >
            No, I Gave In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;

