export interface User {
  id: string;
  email: string;
  name: string;
  rewardCoins: number;
  badges: string[];
  subscriptionTier: 'free' | 'premium';
  createdAt: string;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  type: 'positive' | 'negative';
  schedule: {
    time: string;
    frequency: 'daily';
  };
  trigger?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  streakCount: number;
  lastCheckInDate?: string;
  icon?: string;
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
  requirement: string;
}
