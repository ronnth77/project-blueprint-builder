export type HabitCategory = 'health' | 'chores' | 'hobbies' | 'productivity';

export interface Schedule {
  time: string; // Time in 24-hour format (e.g., "14:30")
  frequency: 'daily' | 'weekly' | 'monthly';
  daysOfWeek?: number[]; // 0-6, where 0 is Sunday, 1 is Monday, etc.
  daysOfMonth?: number[]; // 1-31
}

export interface User {
  id: string;
  email: string;
  name: string;
  totalPoints: number;
  currentStreak: number;
  bestStreak: number;
  badges: Badge[];
  subscriptionTier: 'free' | 'premium';
  createdAt: string;
  habitHistory?: {
    [habitId: string]: HabitHistory;
  };
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  type: 'positive' | 'negative';
  category: HabitCategory;
  schedule: Schedule; // Use the Schedule interface to support daily, weekly, and monthly
  trigger?: string;
  notes?: string;
  motivation?: string;
  reminders: string[]; // Array of times in "HH:MM" format
  confirmationTime?: string; // Time for end-of-day confirmation (break habits only) in "HH:MM" format
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  streakCount: number;
  lastCheckInDate?: string;
  icon?: string;
  checkIns?: HabitCheckIn[]; // Add checkIns property
  totalPointsEarned: number; // Cumulative points earned by this habit
}

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
  earned: boolean;
  dateEarned: string | null;
}

export interface PointsConfig {
  timeframe: string;
  points: number;
  penalty: number;
  duration: number; // days
}

export interface HabitHistory {
  completions: string[]; // dates
  misses: string[]; // dates
  notes: string[];
  currentPointsTier: number;
}

export interface UserProgress {
  userId: string;
  accountCreated: string;
  totalPoints: number;
  currentStreak: number;
  bestStreak: number;
  badges: Badge[];
  habitHistory: {
    [habitId: string]: HabitHistory;
  };
}
