import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { format, addMonths, subMonths, isSameDay, isBefore, isToday, isAfter, addDays, subDays, isSameMonth, isSameYear } from 'date-fns';
import { useState, useMemo } from 'react';
import { HabitCheckIn, Schedule } from '@/types';
import { cn } from '@/lib/utils';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  habitName: string;
  checkIns: HabitCheckIn[];
  streakCount: number;
  schedule: Schedule; // Add schedule prop
}

const CalendarModal = ({ 
  isOpen, 
  onClose, 
  habitName, 
  checkIns = [], 
  streakCount,
  schedule 
}: CalendarModalProps) => {
  // Debug log to check the incoming props
  console.log('CalendarModal props:', {
    habitName,
    checkIns,
    streakCount,
    schedule,
    checkInDates: checkIns?.map(c => ({ date: c.date, completed: c.completed }))
  });
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevMonth = () => setCurrentDate(prev => subMonths(prev, 1));
  const handleNextMonth = () => setCurrentDate(prev => addMonths(prev, 1));

  // Check if a day is a scheduled day for the habit
  const isScheduledDay = (date: Date): boolean => {
    const day = date.getDay(); // 0-6 (Sun-Sat)
    const dateNum = date.getDate();
    const today = new Date();

    if (isAfter(date, today)) return false; // Don't show future days as scheduled

    switch (schedule.frequency) {
      case 'daily':
        return true;
      case 'weekly':
        return schedule.daysOfWeek?.includes(day) ?? false;
      case 'monthly':
        return schedule.daysOfMonth?.includes(dateNum) ?? false;
      default:
        return false;
    }
  };

  // Get status for a specific day
  const getDayStatus = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    
    // If we have check-ins data, use it
    if (checkIns && checkIns.length > 0) {
      const checkIn = checkIns.find(c => c.date === dateStr);
      if (checkIn) {
        return checkIn.completed ? 'completed' : 'missed';
      }
    }
    
    // If it's a scheduled day
    if (isScheduledDay(date)) {
      // If it's today or in the future
      if (dateStr >= todayStr) {
        return 'future';
      }
      
      // If we have a streak but no check-in data, assume the last N days were completed
      if (streakCount > 0) {
        const dateObj = new Date(dateStr);
        const daysAgo = Math.floor((today.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24));
        
        // If this date is within the streak window, mark as completed
        if (daysAgo >= 0 && daysAgo < streakCount) {
          return 'completed';
        }
      }
      
      // If we have check-ins data but no check-in for this date, it's missed
      if (checkIns && checkIns.length > 0) {
        return 'missed';
      }
      
      // Default to not-scheduled if we can't determine the status
      return 'not-scheduled';
    }
    
    // Not a scheduled day
    return 'not-scheduled';
  };

  // Generate days for the current month view
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const days = useMemo(() => {
    const daysArray = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push(<div key={`empty-${i}`} className="h-8" />);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const status = getDayStatus(date);
      const isCurrentDay = isToday(date);

      daysArray.push(
        <div 
          key={day}
          className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center text-sm relative",
            status === 'completed' && "bg-green-100 text-green-800 dark:bg-green-900/50",
            status === 'missed' && "bg-red-100 text-red-800 dark:bg-red-900/50",
            status === 'future' && "text-muted-foreground/50",
            status === 'not-scheduled' && "opacity-30",
            isCurrentDay && "ring-2 ring-blue-500"
          )}
          title={status === 'completed' ? `Completed on ${format(date, 'MMM d, yyyy')}` : 
                 status === 'missed' ? `Missed on ${format(date, 'MMM d, yyyy')}` : ''}
        >
          {day}
          {status === 'completed' && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-green-500" />
          )}
          {status === 'missed' && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-red-500" />
          )}
        </div>
      );
    }

    return daysArray;
  }, [year, month, daysInMonth, firstDayOfMonth, checkIns, schedule]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold text-center">
            {habitName}
          </DialogTitle>
          <div className="flex justify-center items-center gap-4 mt-2">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-amber-500">
                <Flame className="h-4 w-4" />
                <span className="font-bold">{streakCount}</span>
              </div>
              <div className="text-xs text-muted-foreground">Current Streak</div>
            </div>
          </div>
        </DialogHeader>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handlePrevMonth}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="font-medium text-base">
              {format(currentDate, 'MMMM yyyy')}
            </h3>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleNextMonth}
              disabled={format(currentDate, 'yyyy-MM') === format(new Date(), 'yyyy-MM')}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs text-muted-foreground font-medium">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} className="h-8 flex items-center justify-center">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days}
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-100 dark:bg-green-900" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-100 dark:bg-red-900" />
            <span>Missed</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarModal;