export type HabitCategory = 'health' | 'chores' | 'hobbies' | 'productivity';
export type HabitTimeType = 'timer' | 'check-in';

export interface User {
  id: string;
  email: string;
  name: string;
  rewardCoins: number;
  badges: string[];
  subscriptionTier: 'free' | 'premium';
  createdAt: string;
}

interface BaseHabit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  type: 'positive' | 'negative';
  category: HabitCategory;
  schedule: {
    time: string;
    frequency: 'daily';
  };
  trigger?: string;
  notes?: string;
  motivation?: string;
  reminders: string[]; // Array of times in "HH:MM" format
  timeType: HabitTimeType;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  streakCount: number;
  lastCheckInDate?: string;
  icon?: string;
}

export interface TimerHabit extends BaseHabit {
  timeType: 'timer';
  duration: number; // in minutes
  isStrict: boolean;
  timerState?: {
    isRunning: boolean;
    startTime?: string;
    elapsedSeconds: number;
  };
}

export interface CheckInHabit extends BaseHabit {
  timeType: 'check-in';
}

export type Habit = TimerHabit | CheckInHabit;

export interface HabitCheckIn {
  id: string;
  habitId: string;
  userId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  completionPercentage?: number;
  notes?: string;
  timestamp: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
}
