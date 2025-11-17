import { useEffect } from 'react';
import Confetti from 'react-confetti';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/types';
import { motion } from 'framer-motion';

interface BadgeCelebrationProps {
  badge: Badge | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BadgeCelebration = ({ badge, isOpen, onClose }: BadgeCelebrationProps) => {
  useEffect(() => {
    if (isOpen && badge) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, badge, onClose]);

  if (!badge) return null;

  return (
    <>
      {isOpen && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[400px] text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl">🎉 Badge Earned!</DialogTitle>
            <DialogDescription>
              Congratulations on your achievement!
            </DialogDescription>
          </DialogHeader>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="flex flex-col items-center gap-4 py-6"
          >
            <div className="text-8xl">{badge.icon}</div>
            <h3 className="text-2xl font-bold">{badge.name}</h3>
            <p className="text-muted-foreground">{badge.description}</p>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
};
