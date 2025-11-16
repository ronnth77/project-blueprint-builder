import { useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { HabitCheckIn } from '@/types';
import CalendarDay from './CalendarDay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StreakCalendarProps {
  habitName: string;
  checkIns: HabitCheckIn[];
  currentDate?: Date;
  streakCount: number;
}

const StreakCalendar = ({ habitName, checkIns, currentDate = new Date(), streakCount }: StreakCalendarProps) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Create a map of check-ins by date
  const checkInMap = useMemo(() => {
    const map = new Map<string, HabitCheckIn>();
    checkIns.forEach(checkIn => {
      map.set(checkIn.date, checkIn);
    });
    return map;
  }, [checkIns]);

  // Get day of week for first day to calculate offset
  const firstDayOfWeek = monthStart.getDay();
  const emptyDays = Array(firstDayOfWeek).fill(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{habitName}</span>
          <span className="text-sm font-normal text-muted-foreground">
            {format(currentDate, 'MMMM yyyy')}
          </span>
        </CardTitle>
        <CardDescription>
          Current Streak: <span className="font-semibold text-secondary">{streakCount} days 🔥</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Week day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {emptyDays.map((_, index) => (
              <div key={`empty-${index}`} />
            ))}
            {daysInMonth.map(day => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const checkIn = checkInMap.get(dateStr);
              const status = checkIn 
                ? (checkIn.completed ? 'completed' : 'missed')
                : (day <= new Date() ? 'missed' : 'future');

              return (
                <CalendarDay
                  key={dateStr}
                  date={day}
                  status={status as 'completed' | 'missed' | 'future'}
                  isToday={isToday(day)}
                  notes={checkIn?.notes}
                />
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex gap-4 justify-center mt-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-success" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-destructive" />
              <span>Missed</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-muted" />
              <span>Future</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakCalendar;
