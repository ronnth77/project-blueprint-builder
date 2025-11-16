import { Habit } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, Check, Clock, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface HabitCardProps {
  habit: Habit;
  onCheckIn: (habitId: string) => void;
  isCheckedInToday: boolean;
}

const categoryLabels = {
  health: 'Health',
  productivity: 'Work',
  hobbies: 'Hobbies',
  chores: 'Chores',
};

const HabitCard = ({ habit, onCheckIn, isCheckedInToday }: HabitCardProps) => {
  const isPositive = habit.type === 'positive';
  const navigate = useNavigate();

  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all hover:shadow-lg",
        isCheckedInToday && "border-success"
      )}
    >
      {isCheckedInToday && (
        <div className="absolute top-0 right-0 w-16 h-16 bg-success/10 rounded-bl-full" />
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={cn(
              "text-2xl w-10 h-10 rounded-lg flex items-center justify-center",
              isPositive ? "bg-primary/10" : "bg-destructive/10"
            )}>
              {habit.icon || (isPositive ? '✅' : '🚫')}
            </div>
            <div>
              <CardTitle className="text-lg">{habit.name}</CardTitle>
              <CardDescription className="text-xs">
                {habit.schedule.time}
              </CardDescription>
            </div>
          </div>
          {isCheckedInToday && (
            <div className="rounded-full bg-success p-1.5">
              <Check className="h-3 w-3 text-success-foreground" />
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {habit.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {habit.description}
          </p>
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
      </CardContent>
    </Card>
  );
};

export default HabitCard;
