import { useState } from 'react';
import { Habit } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, Check, ChevronDown, Edit, Trash2, Timer as TimerIcon, StickyNote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deleteHabit, updateHabit } from '@/services/mockDataService';
import { toast } from 'sonner';
import { NoteModal } from './NoteModal';

interface HabitCardProps {
  habit: Habit;
  onCheckIn: (habitId: string) => void;
  isCheckedInToday: boolean;
  onUpdate?: () => void;
}

const categoryLabels = {
  health: 'Health',
  productivity: 'Work',
  hobbies: 'Hobbies',
  chores: 'Chores',
};

const HabitCard = ({ habit, onCheckIn, isCheckedInToday, onUpdate }: HabitCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const isPositive = habit.type === 'positive';
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await deleteHabit(habit.id);
      toast.success('Habit deleted successfully');
      onUpdate?.();
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast.error('Failed to delete habit');
    }
  };

  const handleSaveNote = async (note: string) => {
    try {
      await updateHabit(habit.id, { notes: note });
      toast.success('Note saved');
      onUpdate?.();
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note');
    }
  };

  const buttonText = isPositive ? 'Start' : 'Check In';

  return (
    <>
      <Card 
        className={cn(
          "relative overflow-hidden transition-all hover:shadow-lg",
          isCheckedInToday && "border-success"
        )}
      >
        {isCheckedInToday && (
          <div className="absolute top-0 right-0 w-16 h-16 bg-success/10 rounded-bl-full" />
        )}
        
        <CardHeader 
          className="pb-3 cursor-pointer" 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 flex-1">
              <div className={cn(
                "text-2xl w-10 h-10 rounded-lg flex items-center justify-center",
                isPositive ? "bg-primary/10" : "bg-destructive/10"
              )}>
                {habit.icon || (isPositive ? '✅' : '🚫')}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">{habit.name}</CardTitle>
                  {habit.timeType === 'timer' && (
                    <Badge variant="outline" className="text-xs">
                      <TimerIcon className="h-3 w-3 mr-1" />
                      {habit.duration}m
                    </Badge>
                  )}
                  {habit.notes && (
                    <StickyNote className="h-4 w-4 text-primary" />
                  )}
                </div>
                <CardDescription className="text-xs">
                  {habit.schedule.time} • {categoryLabels[habit.category]}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isCheckedInToday && (
                <div className="rounded-full bg-success p-1.5">
                  <Check className="h-3 w-3 text-success-foreground" />
                </div>
              )}
              <ChevronDown 
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform",
                  isExpanded && "rotate-180"
                )} 
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3" onClick={(e) => e.stopPropagation()}>
          {habit.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {habit.description}
            </p>
          )}

          {habit.motivation && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-2">
              <p className="text-xs text-primary font-medium">💡 {habit.motivation}</p>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm">
              <Flame className="h-4 w-4 text-primary" />
              <span className="font-semibold">{habit.streakCount}</span>
              <span className="text-muted-foreground">day streak</span>
            </div>
          </div>

          {!isCheckedInToday && (
            <Button 
              onClick={() => onCheckIn(habit.id)}
              className="w-full"
              variant={isPositive ? "default" : "outline"}
            >
              {buttonText}
            </Button>
          )}

          {isExpanded && (
            <div className="flex gap-2 pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/habits/${habit.id}/edit`);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setNoteModalOpen(true);
                }}
              >
                <StickyNote className="h-4 w-4 mr-2" />
                Note
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Habit</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{habit.name}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </CardContent>
      </Card>

      <NoteModal
        isOpen={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        habitName={habit.name}
        initialNote={habit.notes}
        onSave={handleSaveNote}
      />
    </>
  );
};

export default HabitCard;
