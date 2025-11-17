import { User, Badge, PointsConfig } from '@/types';
import { saveUserData } from './mockDataService';

export const POINTS_CONFIG: PointsConfig[] = [
  { timeframe: 'Week 1', points: 50, penalty: -40, duration: 7 },
  { timeframe: 'Month 1', points: 40, penalty: -30, duration: 30 },
  { timeframe: '3 Months', points: 30, penalty: -20, duration: 90 },
  { timeframe: '6 Months', points: 20, penalty: -10, duration: 180 },
  { timeframe: '1 Year', points: 10, penalty: -5, duration: 365 },
  { timeframe: '1 Year+', points: 5, penalty: -1, duration: Infinity }
];

export const BADGE_MILESTONES = [10, 15, 30, 75, 150, 300]; // days

const getBadgeIcon = (milestone: number): string => {
  if (milestone === 10) return '🥉';
  if (milestone === 15) return '🥈';
  if (milestone === 30) return '🥇';
  if (milestone === 75) return '💎';
  if (milestone === 150) return '👑';
  if (milestone === 300) return '🏆';
  return '⭐';
};

export const calculatePoints = (user: User, habitId: string, completed: boolean): number => {
  const accountCreated = new Date(user.createdAt);
  const daysSinceAccountCreation = Math.floor(
    (new Date().getTime() - accountCreated.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Find current points tier based on account age
  let currentTier = 0;
  let daysCounted = 0;
  
  for (let i = 0; i < POINTS_CONFIG.length; i++) {
    daysCounted += POINTS_CONFIG[i].duration;
    if (daysSinceAccountCreation <= daysCounted || POINTS_CONFIG[i].duration === Infinity) {
      currentTier = i;
      break;
    }
  }
  
  // Get points
  const points = completed 
    ? POINTS_CONFIG[currentTier].points
    : POINTS_CONFIG[currentTier].penalty;
    
  return points;
};

export const updateStreak = (user: User, completed: boolean): User => {
  const updatedUser = { ...user };
  
  if (completed) {
    updatedUser.currentStreak = (user.currentStreak || 0) + 1;
    if (updatedUser.currentStreak > (user.bestStreak || 0)) {
      updatedUser.bestStreak = updatedUser.currentStreak;
    }
  } else {
    updatedUser.currentStreak = 0;
  }
  
  return updatedUser;
};

export const checkForNewBadges = (user: User): Badge[] => {
  const currentStreak = user.currentStreak || 0;
  const earnedBadges = user.badges || [];
  const newBadges: Badge[] = [];
  
  BADGE_MILESTONES.forEach((milestone, index) => {
    const badgeId = `badge-${milestone}`;
    const alreadyEarned = earnedBadges.some(b => b.id === badgeId);
    
    if (currentStreak >= milestone && !alreadyEarned) {
      const newBadge: Badge = {
        id: badgeId,
        name: `${milestone} Days`,
        description: `Maintained a ${milestone}-day streak!`,
        icon: getBadgeIcon(milestone),
        earned: true,
        dateEarned: new Date().toISOString()
      };
      newBadges.push(newBadge);
    }
  });
  
  return newBadges;
};

export const getNextBadgeMilestone = (currentStreak: number): number => {
  for (const milestone of BADGE_MILESTONES) {
    if (currentStreak < milestone) {
      return milestone;
    }
  }
  return BADGE_MILESTONES[BADGE_MILESTONES.length - 1];
};

export const updateUserRewards = async (
  user: User, 
  habitId: string, 
  completed: boolean,
  isPositiveHabit: boolean
): Promise<{ user: User; pointsEarned: number; newBadges: Badge[] }> => {
  let updatedUser = { ...user };
  let pointsEarned = 0;
  let newBadges: Badge[] = [];
  
  // Only update rewards for positive (build) habits
  if (isPositiveHabit) {
    // Calculate and update points
    pointsEarned = calculatePoints(user, habitId, completed);
    updatedUser.totalPoints = (user.totalPoints || 0) + pointsEarned;
    
    // Update streak
    updatedUser = updateStreak(updatedUser, completed);
    
    // Check for new badges
    newBadges = checkForNewBadges(updatedUser);
    if (newBadges.length > 0) {
      updatedUser.badges = [...(updatedUser.badges || []), ...newBadges];
    }
    
    // Initialize habit history if needed
    if (!updatedUser.habitHistory) {
      updatedUser.habitHistory = {};
    }
    if (!updatedUser.habitHistory[habitId]) {
      updatedUser.habitHistory[habitId] = {
        completions: [],
        misses: [],
        notes: [],
        currentPointsTier: 0
      };
    }
    
    // Update habit history
    const today = new Date().toISOString().split('T')[0];
    if (completed) {
      updatedUser.habitHistory[habitId].completions.push(today);
    } else {
      updatedUser.habitHistory[habitId].misses.push(today);
    }
    
    // Save updated user
    await saveUserData(user.id, updatedUser);
  }
  
  return { user: updatedUser, pointsEarned, newBadges };
};
