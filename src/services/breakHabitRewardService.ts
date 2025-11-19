import { User, Habit } from '@/types';
import { calculatePoints } from './rewardService';
import { saveUserData, updateHabit } from './mockDataService';

/**
 * Update rewards for break (negative) habits
 * - When completed (user avoided the behavior) → Earn points
 * - When missed (user gave in) → Deduct points (penalty)
 */
export const updateBreakHabitRewards = async (
  user: User,
  habit: Habit,
  completed: boolean
): Promise<{ user: User; pointsEarned: number }> => {
  let updatedUser = { ...user };
  let pointsEarned = 0;

  // Calculate points (same structure as positive habits)
  // completed=true means user avoided the behavior (reward)
  // completed=false means user gave in (penalty)
  pointsEarned = calculatePoints(user, habit.id, completed);

  // Update user's total points
  updatedUser.totalPoints = (user.totalPoints || 0) + pointsEarned;

  // Update habit's cumulative points
  const currentHabitPoints = habit.totalPointsEarned || 0;
  const newHabitPoints = currentHabitPoints + pointsEarned;
  await updateHabit(habit.id, { totalPointsEarned: newHabitPoints });

  // Initialize habit history if needed
  if (!updatedUser.habitHistory) {
    updatedUser.habitHistory = {};
  }
  if (!updatedUser.habitHistory[habit.id]) {
    updatedUser.habitHistory[habit.id] = {
      completions: [],
      misses: [],
      notes: [],
      currentPointsTier: 0
    };
  }

  // Update habit history
  const today = new Date().toISOString().split('T')[0];
  if (completed) {
    updatedUser.habitHistory[habit.id].completions.push(today);
  } else {
    updatedUser.habitHistory[habit.id].misses.push(today);
  }

  // Save updated user
  await saveUserData(user.id, updatedUser);

  return { user: updatedUser, pointsEarned };
};

