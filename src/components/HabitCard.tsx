import { useState } from 'react';
import { Habit } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, Check, Clock, Eye, ChevronDown, Edit, Trash2, Timer as TimerIcon } from 'lucide-react';
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
import { deleteHabit } from '@/services/mockDataService';
import { toast } from 'sonner';

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

  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all hover:shadow-lg cursor-pointer",
        isCheckedInToday && "border-success"
      )}
    >
      {isCheckedInToday && (
        <div className="absolute top-0 right-0 w-16 h-16 bg-success/10 rounded-bl-full" />
      )}
      
      <CardHeader className="pb-3" onClick={() => setIsExpanded(!isExpanded)}>
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
              </div>
              <CardDescription className="text-xs">
                {habit.schedule.time}
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
        
        {habit.trigger && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {habit.trigger}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge variant={isPositive ? "default" : "destructive"} className="text-xs">
              {isPositive ? 'Build' : 'Break'}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {categoryLabels[habit.category]}
            </Badge>
          </div>
          
          <div className="flex items-center gap-1 text-sm font-semibold">
            <Flame className="h-4 w-4 text-secondary" />
            <span className="text-secondary">{habit.streakCount}</span>
            <span className="text-muted-foreground">days</span>
          </div>
        </div>

        {isExpanded && (
          <div className="pt-3 border-t space-y-2">
            {habit.reminders && habit.reminders.length > 0 && (
              <div className="text-xs text-muted-foreground">
                <strong>Reminders:</strong> {habit.reminders.join(', ')}
              </div>
            )}
            
            <div className="flex gap-2">
              <Button
                onClick={() => navigate(`/habits/${habit.id}/edit`)}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
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
          </div>
        )}

        {!isExpanded && (
          <div className="flex gap-2">
            <Button
              onClick={() => onCheckIn(habit.id)}
              disabled={isCheckedInToday}
              variant={isCheckedInToday ? "outline" : "default"}
              className="flex-1"
              size="sm"
            >
              {isCheckedInToday ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Completed Today
                </>
              ) : (
                'Check In'
              )}
            </Button>
            <Button
              onClick={() => navigate(`/habits/${habit.id}`)}
              variant="outline"
              size="sm"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HabitCard;
