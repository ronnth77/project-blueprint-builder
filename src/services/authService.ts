import { User } from '@/types';
import { initializeDemoData, getUserData, saveUserData } from './mockDataService';

const STORAGE_KEY = 'habitforge_current_user';

// Mock authentication - any email/password works
export const signUp = async (email: string, password: string, name: string): Promise<User> => {
  // Initialize demo data on first signup
  initializeDemoData();
  
  const userId = `user-${Date.now()}`;
  const newUser: User = {
    id: userId,
    email,
    name,
    rewardCoins: 0,
    badges: [],
    subscriptionTier: 'free',
    createdAt: new Date().toISOString(),
  };
  
  await saveUserData(userId, newUser);
  localStorage.setItem(STORAGE_KEY, userId);
  
  return newUser;
};

export const signIn = async (email: string, password: string): Promise<User> => {
  // Initialize demo data if not already done
  const demoUserId = initializeDemoData();
  
  // For demo purposes, if using demo credentials, return demo user
  if (email === 'demo@habitforge.com') {
    localStorage.setItem(STORAGE_KEY, demoUserId);
    const user = await getUserData(demoUserId);
    if (user) return user;
  }
  
  // Otherwise, create a new user (mock behavior - any credentials work)
  const userId = `user-${Date.now()}`;
  const newUser: User = {
    id: userId,
    email,
    name: email.split('@')[0],
    rewardCoins: 0,
    badges: [],
    subscriptionTier: 'free',
    createdAt: new Date().toISOString(),
  };
  
  await saveUserData(userId, newUser);
  localStorage.setItem(STORAGE_KEY, userId);
  
  return newUser;
};

export const signOut = async (): Promise<void> => {
  localStorage.removeItem(STORAGE_KEY);
};

export const getCurrentUser = async (): Promise<User | null> => {
  const userId = localStorage.getItem(STORAGE_KEY);
  if (!userId) return null;
  
  return await getUserData(userId);
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem(STORAGE_KEY);
};
