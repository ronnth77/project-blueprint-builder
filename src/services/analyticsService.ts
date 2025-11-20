import { HabitCheckIn, Habit, Schedule } from '@/types';
import { format, parseISO, differenceInDays, isAfter, isBefore, startOfDay } from 'date-fns';

/**
 * Find all streaks in check-in history
 * Returns an array of streak lengths
 */
const findAllStreaks = (checkIns: HabitCheckIn[]): number[] => {
  // Filter and sort completed check-ins by date (oldest first)
  const completedCheckIns = checkIns
    .filter(c => c.completed)
    .map(c => ({ date: parseISO(c.date), checkIn: c }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  if (completedCheckIns.length === 0) {
    return [];
  }

  const streaks: number[] = [];
  let currentStreak = 1;

  for (let i = 1; i < completedCheckIns.length; i++) {
    const prevDate = completedCheckIns[i - 1].date;
    const currentDate = completedCheckIns[i].date;
    const dayDiff = differenceInDays(currentDate, prevDate);

    if (dayDiff === 1) {
      // Consecutive day - continue streak
      currentStreak++;
    } else {
      // Gap found - save current streak and start new one
      if (currentStreak > 0) {
        streaks.push(currentStreak);
      }
      currentStreak = 1;
    }
  }

  // Don't forget to add the last streak
  if (currentStreak > 0) {
    streaks.push(currentStreak);
  }

  return streaks;
};

/**
 * Calculate the longest streak from all historical streaks
 */
export const calculateLongestStreak = (checkIns: HabitCheckIn[]): number => {
  const streaks = findAllStreaks(checkIns);
  
  if (streaks.length === 0) {
    return 0;
  }

  return Math.max(...streaks);
};

/**
 * Calculate the average streak length from all historical streaks
 */
export const calculateAverageStreak = (checkIns: HabitCheckIn[]): number => {
  const streaks = findAllStreaks(checkIns);
  
  if (streaks.length === 0) {
    return 0;
  }

  const sum = streaks.reduce((acc, streak) => acc + streak, 0);
  const average = sum / streaks.length;
  
  // Round to 1 decimal place
  return Math.round(average * 10) / 10;
};

/**
 * Check if a date is a scheduled day based on the habit's schedule
 */
export const isScheduledDay = (date: Date, schedule: Schedule, habitCreatedAt: Date): boolean => {
  const today = startOfDay(new Date());
  const checkDate = startOfDay(date);
  const createdDate = startOfDay(habitCreatedAt);

  // Don't count future days
  if (isAfter(checkDate, today)) {
    return false;
  }

  // Don't count days before habit creation
  if (isBefore(checkDate, createdDate)) {
    return false;
  }

  const dayOfWeek = checkDate.getDay(); // 0-6 (Sun-Sat)
  const dayOfMonth = checkDate.getDate(); // 1-31

  switch (schedule.frequency) {
    case 'daily':
      return true;
    case 'weekly':
      return schedule.daysOfWeek?.includes(dayOfWeek) ?? false;
    case 'monthly':
      return schedule.daysOfMonth?.includes(dayOfMonth) ?? false;
    default:
      return false;
  }
};

/**
 * Calculate total scheduled days from habit creation to today
 */
const calculateTotalScheduledDays = (habit: Habit): number => {
  const createdAt = parseISO(habit.createdAt);
  const today = startOfDay(new Date());
  const startDate = startOfDay(createdAt);

  if (isAfter(startDate, today)) {
    return 0;
  }

  let count = 0;
  const currentDate = new Date(startDate);

  while (!isAfter(currentDate, today)) {
    if (isScheduledDay(currentDate, habit.schedule, createdAt)) {
      count++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return count;
};

/**
 * Calculate completion rate as a percentage
 * Formula: (completed check-ins / total scheduled days) * 100
 */
export const calculateCompletionRate = (checkIns: HabitCheckIn[], habit: Habit): number => {
  const completedCount = checkIns.filter(c => c.completed).length;
  const totalScheduled = calculateTotalScheduledDays(habit);

  if (totalScheduled === 0) {
    return 0;
  }

  const rate = (completedCount / totalScheduled) * 100;
  
  // Round to 1 decimal place
  return Math.round(rate * 10) / 10;
};

