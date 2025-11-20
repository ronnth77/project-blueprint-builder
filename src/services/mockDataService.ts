import { User, Habit, HabitCheckIn, TimerHabit, CheckInHabit } from '@/types';
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
      totalPoints: 250,
      currentStreak: 7,
      bestStreak: 12,
      badges: [
        {
          id: 'badge-10',
          name: '10 Days',
          description: 'Maintained a 10-day streak!',
          icon: '🥉',
          earned: true,
          dateEarned: new Date().toISOString(),
        }
      ],
      subscriptionTier: 'free',
      createdAt: now,
      habitHistory: {},
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
        motivation: 'Start your day with clarity and focus',
        createdAt: subDays(new Date(), 30).toISOString(),
        updatedAt: now,
        isActive: true,
        streakCount: 7,
        totalPointsEarned: 0,
        lastCheckInDate: format(new Date(), 'yyyy-MM-dd'),
        icon: '🧘',
        reminders: ['07:00'],
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
        motivation: 'Keep your body strong and healthy',
        createdAt: subDays(new Date(), 20).toISOString(),
        updatedAt: now,
        isActive: true,
        streakCount: 5,
        totalPointsEarned: 0,
        lastCheckInDate: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
        icon: '💪',
        reminders: ['18:00'],
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
        motivation: 'Expand your knowledge and relax before bed',
        createdAt: subDays(new Date(), 15).toISOString(),
        updatedAt: now,
        isActive: true,
        streakCount: 3,
        totalPointsEarned: 0,
        lastCheckInDate: format(new Date(), 'yyyy-MM-dd'),
        icon: '📚',
        reminders: ['20:00'],
      },
      {
        id: 'habit-4',
        userId: demoUserId,
        name: 'Avoid Social Media',
        description: 'No mindless scrolling during work hours',
        type: 'negative',
        category: 'productivity',
        schedule: { time: '09:00', frequency: 'daily' },
        motivation: 'Stay focused and protect your attention',
        createdAt: subDays(new Date(), 10).toISOString(),
        updatedAt: now,
        isActive: true,
        streakCount: 12,
        totalPointsEarned: 0,
        lastCheckInDate: format(new Date(), 'yyyy-MM-dd'),
        icon: '🚫',
        confirmationTime: '21:00', // End of day confirmation time for break habits
        reminders: ['09:00', '12:00', '15:00'],
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

// Migrate timer habits to check-in type (remove timer fields)
const migrateTimerHabit = (habit: any): Habit => {
  // Remove timer-related fields if they exist
  const { duration, isStrict, timerState, timeType, ...rest } = habit;
  return rest as Habit;
};

// Habit operations
export const getAllHabits = async (userId: string): Promise<Habit[]> => {
  const habits = getFromStorage<Record<string, Habit>>(STORAGE_KEYS.HABITS) || {};
  const userHabits = Object.values(habits).filter((habit) => habit.userId === userId && habit.isActive);
  
  // Migrate timer habits and initialize totalPointsEarned
  const updatedHabits = userHabits.map(habit => {
    let updatedHabit = habit;
    
    // Migrate timer habits to check-in (remove timer fields)
    if ('timeType' in habit || 'duration' in habit || 'isStrict' in habit || 'timerState' in habit) {
      updatedHabit = migrateTimerHabit(habit);
      habits[habit.id] = updatedHabit;
    }
    
    // Initialize totalPointsEarned if missing
    if (updatedHabit.totalPointsEarned === undefined) {
      updatedHabit = { ...updatedHabit, totalPointsEarned: 0 };
      habits[habit.id] = updatedHabit;
    }
    
    return updatedHabit;
  });
  
  // Save updated habits if any were modified
  if (updatedHabits.some((h, i) => h !== userHabits[i])) {
    saveToStorage(STORAGE_KEYS.HABITS, habits);
  }
  
  return updatedHabits;
};

export const getHabitById = async (habitId: string): Promise<Habit | null> => {
  const habits = getFromStorage<Record<string, Habit>>(STORAGE_KEYS.HABITS) || {};
  let habit = habits[habitId];
  
  if (!habit) return null;
  
  let updated = false;
  
  // Migrate timer habit to check-in (remove timer fields)
  if ('timeType' in habit || 'duration' in habit || 'isStrict' in habit || 'timerState' in habit) {
    habit = migrateTimerHabit(habit);
    habits[habitId] = habit;
    updated = true;
  }
  
  // Initialize totalPointsEarned if missing
  if (habit.totalPointsEarned === undefined) {
    habit = { ...habit, totalPointsEarned: 0 };
    habits[habitId] = habit;
    updated = true;
  }
  
  // Save if updated
  if (updated) {
    saveToStorage(STORAGE_KEYS.HABITS, habits);
  }
  
  return habit;
};

export const createHabit = async (userId: string, habitData: any): Promise<Habit> => {
  const habits = getFromStorage<Record<string, Habit>>(STORAGE_KEYS.HABITS) || {};
  const habitId = `habit-${Date.now()}`;
  const now = new Date().toISOString();
  
  const newHabit: Habit = {
    id: habitId,
    userId,
    createdAt: now,
    updatedAt: now,
    isActive: true,
    streakCount: 0,
    totalPointsEarned: 0,
    name: habitData.name,
    description: habitData.description,
    type: habitData.type,
    category: habitData.category,
    schedule: habitData.schedule,
    trigger: habitData.trigger,
    notes: habitData.notes,
    motivation: habitData.motivation,
    icon: habitData.icon,
    reminders: habitData.reminders || [],
    confirmationTime: habitData.confirmationTime, // Only for break habits
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
  
  const updatedHabit: Habit = {
    ...habit,
    ...updates,
    updatedAt: new Date().toISOString(),
  } as Habit;
  
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
