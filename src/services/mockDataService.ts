import { User, Habit, HabitCheckIn } from '@/types';
import { format, subDays } from 'date-fns';

// LocalStorage keys
const STORAGE_KEYS = {
  USERS: 'habitforge_users',
  HABITS: 'habitforge_habits',
  CHECKINS: 'habitforge_checkins',
  CURRENT_USER: 'habitforge_current_user',
  INITIALIZED: 'habitforge_initialized',
};

// Helper to get from LocalStorage
const getFromStorage = <T>(key: string): T | null => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

// Helper to save to LocalStorage
const saveToStorage = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Initialize demo data
export const initializeDemoData = (): string => {
  const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  
  if (!initialized) {
    const demoUserId = 'demo-user-1';
    const now = new Date().toISOString();

    // Demo user
    const demoUser: User = {
      id: demoUserId,
      email: 'demo@habitforge.com',
      name: 'Demo User',
      rewardCoins: 125,
      badges: ['daily_routine', 'week_warrior'],
      subscriptionTier: 'free',
      createdAt: now,
    };

    // Demo habits
    const demoHabits: Habit[] = [
      {
        id: 'habit-1',
        userId: demoUserId,
        name: 'Morning Meditation',
        description: 'Start the day with 10 minutes of mindfulness',
        type: 'positive',
        category: 'health',
        schedule: { time: '07:00', frequency: 'daily' },
        trigger: 'After waking up',
        createdAt: subDays(new Date(), 30).toISOString(),
        updatedAt: now,
        isActive: true,
        streakCount: 7,
        lastCheckInDate: format(new Date(), 'yyyy-MM-dd'),
        icon: '🧘',
      },
      {
        id: 'habit-2',
        userId: demoUserId,
        name: 'Evening Exercise',
        description: '30 minutes of cardio or strength training',
        type: 'positive',
        category: 'health',
        schedule: { time: '18:00', frequency: 'daily' },
        trigger: 'Before dinner',
        createdAt: subDays(new Date(), 20).toISOString(),
        updatedAt: now,
        isActive: true,
        streakCount: 5,
        lastCheckInDate: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
        icon: '💪',
      },
      {
        id: 'habit-3',
        userId: demoUserId,
        name: 'Read 30 Minutes',
        description: 'Read books or articles before bed',
        type: 'positive',
        category: 'hobbies',
        schedule: { time: '20:00', frequency: 'daily' },
        trigger: 'Before sleep',
        createdAt: subDays(new Date(), 15).toISOString(),
        updatedAt: now,
        isActive: true,
        streakCount: 3,
        lastCheckInDate: format(new Date(), 'yyyy-MM-dd'),
        icon: '📚',
      },
      {
        id: 'habit-4',
        userId: demoUserId,
        name: 'Avoid Social Media',
        description: 'No mindless scrolling during work hours',
        type: 'negative',
        category: 'productivity',
        schedule: { time: '09:00', frequency: 'daily' },
        createdAt: subDays(new Date(), 10).toISOString(),
        updatedAt: now,
        isActive: true,
        streakCount: 12,
        lastCheckInDate: format(new Date(), 'yyyy-MM-dd'),
        icon: '🚫',
      },
    ];

    // Generate demo check-ins for the last 30 days
    const demoCheckIns: HabitCheckIn[] = [];
    
    demoHabits.forEach((habit) => {
      for (let i = 0; i < 30; i++) {
        const date = subDays(new Date(), i);
        const dateStr = format(date, 'yyyy-MM-dd');
        
        // Create realistic check-in patterns
        const shouldHaveCheckIn = i < (habit.streakCount + 3); // Recent streak plus a few misses
        if (shouldHaveCheckIn && Math.random() > 0.2) { // 80% completion rate
          demoCheckIns.push({
            id: `checkin-${habit.id}-${i}`,
            habitId: habit.id,
            userId: demoUserId,
            date: dateStr,
            completed: true,
            completionPercentage: Math.random() > 0.3 ? 100 : Math.floor(Math.random() * 50) + 50,
            timestamp: date.toISOString(),
          });
        }
      }
    });

    // Save to LocalStorage
    const users: Record<string, User> = { [demoUserId]: demoUser };
    const habits: Record<string, Habit> = {};
    const checkIns: Record<string, HabitCheckIn> = {};

    demoHabits.forEach((habit) => {
      habits[habit.id] = habit;
    });

    demoCheckIns.forEach((checkIn) => {
      checkIns[checkIn.id] = checkIn;
    });

    saveToStorage(STORAGE_KEYS.USERS, users);
    saveToStorage(STORAGE_KEYS.HABITS, habits);
    saveToStorage(STORAGE_KEYS.CHECKINS, checkIns);
    saveToStorage(STORAGE_KEYS.INITIALIZED, 'true');
  }

  return 'demo-user-1';
};

// User operations
export const getUserData = async (userId: string): Promise<User | null> => {
  const users = getFromStorage<Record<string, User>>(STORAGE_KEYS.USERS) || {};
  return users[userId] || null;
};

export const saveUserData = async (userId: string, userData: Partial<User>): Promise<User> => {
  const users = getFromStorage<Record<string, User>>(STORAGE_KEYS.USERS) || {};
  const existingUser = users[userId] || {};
  const updatedUser = { ...existingUser, ...userData, id: userId } as User;
  users[userId] = updatedUser;
  saveToStorage(STORAGE_KEYS.USERS, users);
  return updatedUser;
};

// Habit operations
export const getAllHabits = async (userId: string): Promise<Habit[]> => {
  const habits = getFromStorage<Record<string, Habit>>(STORAGE_KEYS.HABITS) || {};
  return Object.values(habits).filter((habit) => habit.userId === userId && habit.isActive);
};

export const getHabitById = async (habitId: string): Promise<Habit | null> => {
  const habits = getFromStorage<Record<string, Habit>>(STORAGE_KEYS.HABITS) || {};
  return habits[habitId] || null;
};

export const createHabit = async (userId: string, habitData: Omit<Habit, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'streakCount' | 'isActive'>): Promise<Habit> => {
  const habits = getFromStorage<Record<string, Habit>>(STORAGE_KEYS.HABITS) || {};
  const habitId = `habit-${Date.now()}`;
  const now = new Date().toISOString();
  
  const newHabit: Habit = {
    ...habitData,
    id: habitId,
    userId,
    createdAt: now,
    updatedAt: now,
    isActive: true,
    streakCount: 0,
  };
  
  habits[habitId] = newHabit;
  saveToStorage(STORAGE_KEYS.HABITS, habits);
  return newHabit;
};

export const updateHabit = async (habitId: string, updates: Partial<Habit>): Promise<Habit> => {
  const habits = getFromStorage<Record<string, Habit>>(STORAGE_KEYS.HABITS) || {};
  const habit = habits[habitId];
  
  if (!habit) {
    throw new Error('Habit not found');
  }
  
  const updatedHabit = {
    ...habit,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  habits[habitId] = updatedHabit;
  saveToStorage(STORAGE_KEYS.HABITS, habits);
  return updatedHabit;
};

export const deleteHabit = async (habitId: string): Promise<void> => {
  const habits = getFromStorage<Record<string, Habit>>(STORAGE_KEYS.HABITS) || {};
  if (habits[habitId]) {
    habits[habitId].isActive = false;
    saveToStorage(STORAGE_KEYS.HABITS, habits);
  }
};

// Check-in operations
export const createCheckIn = async (habitId: string, userId: string, checkInData: Omit<HabitCheckIn, 'id' | 'habitId' | 'userId' | 'timestamp'>): Promise<HabitCheckIn> => {
  const checkIns = getFromStorage<Record<string, HabitCheckIn>>(STORAGE_KEYS.CHECKINS) || {};
  const checkInId = `checkin-${habitId}-${Date.now()}`;
  
  const newCheckIn: HabitCheckIn = {
    ...checkInData,
    id: checkInId,
    habitId,
    userId,
    timestamp: new Date().toISOString(),
  };
  
  checkIns[checkInId] = newCheckIn;
  saveToStorage(STORAGE_KEYS.CHECKINS, checkIns);
  
  // Update habit streak
  await calculateAndUpdateStreak(habitId);
  
  return newCheckIn;
};

export const getCheckIns = async (habitId: string, startDate?: Date, endDate?: Date): Promise<HabitCheckIn[]> => {
  const checkIns = getFromStorage<Record<string, HabitCheckIn>>(STORAGE_KEYS.CHECKINS) || {};
  let habitCheckIns = Object.values(checkIns).filter((checkIn) => checkIn.habitId === habitId);
  
  if (startDate) {
    const startStr = format(startDate, 'yyyy-MM-dd');
    habitCheckIns = habitCheckIns.filter((checkIn) => checkIn.date >= startStr);
  }
  
  if (endDate) {
    const endStr = format(endDate, 'yyyy-MM-dd');
    habitCheckIns = habitCheckIns.filter((checkIn) => checkIn.date <= endStr);
  }
  
  return habitCheckIns.sort((a, b) => b.date.localeCompare(a.date));
};

export const getCheckInForDate = async (habitId: string, date: string): Promise<HabitCheckIn | null> => {
  const checkIns = getFromStorage<Record<string, HabitCheckIn>>(STORAGE_KEYS.CHECKINS) || {};
  return Object.values(checkIns).find((checkIn) => checkIn.habitId === habitId && checkIn.date === date) || null;
};

// Calculate streak
const calculateAndUpdateStreak = async (habitId: string): Promise<number> => {
  const checkIns = await getCheckIns(habitId);
  const completedCheckIns = checkIns.filter((c) => c.completed).sort((a, b) => b.date.localeCompare(a.date));
  
  if (completedCheckIns.length === 0) {
    await updateHabit(habitId, { streakCount: 0 });
    return 0;
  }
  
  let streak = 0;
  const today = format(new Date(), 'yyyy-MM-dd');
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
  
  // Check if there's a check-in today or yesterday to start the streak
  if (completedCheckIns[0].date === today || completedCheckIns[0].date === yesterday) {
    streak = 1;
    
    // Count consecutive days
    for (let i = 1; i < completedCheckIns.length; i++) {
      const currentDate = new Date(completedCheckIns[i - 1].date);
      const prevDate = new Date(completedCheckIns[i].date);
      const dayDiff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        streak++;
      } else {
        break;
      }
    }
  }
  
  await updateHabit(habitId, { streakCount: streak, lastCheckInDate: completedCheckIns[0].date });
  return streak;
};

export const calculateStreak = async (habitId: string): Promise<number> => {
  return calculateAndUpdateStreak(habitId);
};
