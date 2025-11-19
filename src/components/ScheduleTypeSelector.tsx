import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Schedule } from '@/types';
import { cn } from '@/lib/utils';

interface ScheduleTypeSelectorProps {
  schedule: Schedule;
  onScheduleChange: (schedule: Schedule) => void;
}

const ScheduleTypeSelector = ({ schedule, onScheduleChange }: ScheduleTypeSelectorProps) => {
  const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState<number[]>(schedule.daysOfWeek || []);
  const [selectedDaysOfMonth, setSelectedDaysOfMonth] = useState<number[]>(schedule.daysOfMonth || []);

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayValues = [0, 1, 2, 3, 4, 5, 6];

  // Sync local state when schedule prop changes (e.g., when editing existing habit)
  useEffect(() => {
    if (schedule.daysOfWeek) {
      setSelectedDaysOfWeek(schedule.daysOfWeek);
    }
    if (schedule.daysOfMonth) {
      setSelectedDaysOfMonth(schedule.daysOfMonth);
    }
  }, [schedule.daysOfWeek, schedule.daysOfMonth]);

  // Update parent when local state changes (but not on initial mount to avoid unnecessary updates)
  useEffect(() => {
    // Only update if we have selections that differ from current schedule
    const shouldUpdate = 
      (schedule.frequency === 'weekly' && JSON.stringify(selectedDaysOfWeek) !== JSON.stringify(schedule.daysOfWeek || [])) ||
      (schedule.frequency === 'monthly' && JSON.stringify(selectedDaysOfMonth) !== JSON.stringify(schedule.daysOfMonth || []));
    
    if (shouldUpdate) {
      const newSchedule: Schedule = {
        ...schedule,
        daysOfWeek: schedule.frequency === 'weekly' ? selectedDaysOfWeek : undefined,
        daysOfMonth: schedule.frequency === 'monthly' ? selectedDaysOfMonth : undefined,
      };
      onScheduleChange(newSchedule);
    }
  }, [selectedDaysOfWeek, selectedDaysOfMonth]);

  const handleFrequencyChange = (frequency: 'daily' | 'weekly' | 'monthly') => {
    const newSchedule: Schedule = {
      ...schedule,
      frequency,
      daysOfWeek: frequency === 'weekly' ? selectedDaysOfWeek : undefined,
      daysOfMonth: frequency === 'monthly' ? selectedDaysOfMonth : undefined,
    };
    onScheduleChange(newSchedule);
  };

  const toggleDayOfWeek = (day: number) => {
    setSelectedDaysOfWeek(prev => {
      if (prev.includes(day)) {
        const newDays = prev.filter(d => d !== day);
        return newDays.length > 0 ? newDays : prev; // Prevent deselecting all
      } else {
        return [...prev, day];
      }
    });
  };

  const toggleDayOfMonth = (day: number) => {
    setSelectedDaysOfMonth(prev => {
      if (prev.includes(day)) {
        const newDays = prev.filter(d => d !== day);
        return newDays.length > 0 ? newDays : prev; // Prevent deselecting all
      } else {
        return [...prev, day];
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="schedule-type">Schedule Type</Label>
        <Select
          value={schedule.frequency}
          onValueChange={(value) => handleFrequencyChange(value as 'daily' | 'weekly' | 'monthly')}
        >
          <SelectTrigger id="schedule-type">
            <SelectValue placeholder="Select schedule type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {schedule.frequency === 'weekly' && (
        <div className="space-y-2">
          <Label>Select Days</Label>
          <div className="flex flex-wrap gap-2">
            {dayValues.map((day) => (
              <Button
                key={day}
                type="button"
                variant={selectedDaysOfWeek.includes(day) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleDayOfWeek(day)}
                className={cn(
                  "min-w-[60px]",
                  selectedDaysOfWeek.includes(day) && "bg-primary text-primary-foreground"
                )}
              >
                {dayLabels[day]}
              </Button>
            ))}
          </div>
          {selectedDaysOfWeek.length === 0 && (
            <p className="text-sm text-muted-foreground">Please select at least one day</p>
          )}
        </div>
      )}

      {schedule.frequency === 'monthly' && (
        <div className="space-y-2">
          <Label>Select Days (1-31)</Label>
          <div className="grid grid-cols-7 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <Button
                key={day}
                type="button"
                variant={selectedDaysOfMonth.includes(day) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleDayOfMonth(day)}
                className={cn(
                  "h-8 w-8 p-0 text-xs",
                  selectedDaysOfMonth.includes(day) && "bg-primary text-primary-foreground"
                )}
              >
                {day}
              </Button>
            ))}
          </div>
          {selectedDaysOfMonth.length === 0 && (
            <p className="text-sm text-muted-foreground">Please select at least one day</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ScheduleTypeSelector;

