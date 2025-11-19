import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, isToday, isAfter } from 'date-fns';
import { useState, useMemo, useEffect } from 'react';
import { HabitCheckIn, Schedule, Habit } from '@/types';
import { cn } from '@/lib/utils';
import { calculateLongestStreak, calculateAverageStreak, calculateCompletionRate } from '@/services/analyticsService';
import { getCheckIns } from '@/services/mockDataService';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  habitName: string;
  checkIns: HabitCheckIn[];
  streakCount: number;
  schedule: Schedule;
  habit: Habit;
}

const AnalyticsModal = ({ 
  isOpen, 
  onClose, 
  habitName, 
  checkIns = [], 
  streakCount,
  schedule,
  habit
}: AnalyticsModalProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [checkInData, setCheckInData] = useState<HabitCheckIn[]>(checkIns || []);

  useEffect(() => {
    let isMounted = true;

    const fetchCheckIns = async () => {
      if (!habit?.id || !isOpen) return;
      try {
        const data = await getCheckIns(habit.id);
        if (isMounted) {
          setCheckInData(data);
        }
      } catch (error) {
        console.error('Failed to load habit analytics data:', error);
        if (isMounted && (checkIns?.length ?? 0) > 0) {
          setCheckInData(checkIns);
        }
      }
    };

    fetchCheckIns();

    return () => {
      isMounted = false;
    };
  }, [habit?.id, isOpen, checkIns]);

  const handlePrevMonth = () => setCurrentDate(prev => subMonths(prev, 1));
  const handleNextMonth = () => setCurrentDate(prev => addMonths(prev, 1));

  // Calculate analytics metrics
  const longestStreak = useMemo(() => calculateLongestStreak(checkInData), [checkInData]);
  const averageStreak = useMemo(() => calculateAverageStreak(checkInData), [checkInData]);
  const completionRate = useMemo(() => calculateCompletionRate(checkInData, habit), [checkInData, habit]);

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
    if (checkInData && checkInData.length > 0) {
      const checkIn = checkInData.find(c => c.date === dateStr);
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
      if (checkInData && checkInData.length > 0) {
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
  }, [year, month, daysInMonth, firstDayOfMonth, checkInData, schedule, streakCount]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold text-center">
            Habit Analytics
          </DialogTitle>
        </DialogHeader>
        
        {/* Analytics Metrics Boxes */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {longestStreak}
              </div>
              <div className="text-xs text-muted-foreground">
                Longest Streak
              </div>
              <div className="text-xs text-muted-foreground mt-1">days</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {averageStreak}
              </div>
              <div className="text-xs text-muted-foreground">
                Avg. Streak
              </div>
              <div className="text-xs text-muted-foreground mt-1">days</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {completionRate}%
              </div>
              <div className="text-xs text-muted-foreground">
                Completion
              </div>
              <div className="text-xs text-muted-foreground mt-1">Rate</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Calendar View */}
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

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-4 text-xs">
          <div className="flex flex-col items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <span className="text-muted-foreground">Completed</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-muted-foreground">Missed</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AnalyticsModal;

