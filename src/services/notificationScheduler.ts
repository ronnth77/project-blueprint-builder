import { useEffect, useRef } from 'react';
import { Habit, User } from '@/types';
import { format, isSameDay, isBefore } from 'date-fns';
import { toast } from 'sonner';
import { getCheckIns } from './mockDataService';
import { isScheduledDay } from './analyticsService';

interface NotificationSchedulerProps {
  habits: Habit[];
  user: User | null;
  onConfirmationNeeded: (habit: Habit) => void;
}

/**
 * Hook to schedule and show notifications for habits
 * - Shows reminder notifications at reminder times
 * - Shows confirmation dialog for break habits at confirmation time
 * - Only works when browser/app is open (prototype limitation)
 */
export const useNotificationScheduler = ({
  habits,
  user,
  onConfirmationNeeded,
}: NotificationSchedulerProps) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastCheckedTimeRef = useRef<string>('');
  const confirmedHabitsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!user || habits.length === 0) return;

    // Check notifications every minute
    const checkNotifications = async () => {
      const now = new Date();
      const currentTime = format(now, 'HH:mm');
      const today = format(now, 'yyyy-MM-dd');

      // Reset confirmed habits at midnight
      if (!lastCheckedTimeRef.current || !isSameDay(now, new Date(lastCheckedTimeRef.current))) {
        confirmedHabitsRef.current.clear();
        lastCheckedTimeRef.current = now.toISOString();
      }

      // Check all active habits
      for (const habit of habits) {
        if (!habit.isActive) continue;

        // Check if habit is scheduled for today
        const habitCreatedAt = new Date(habit.createdAt);
        if (!isScheduledDay(now, habit.schedule, habitCreatedAt)) {
          continue; // Skip if not scheduled today
        }

        // Check reminder notifications
        for (const reminderTime of habit.reminders) {
          if (reminderTime === currentTime) {
            // Build habits: Don't show if already checked in
            if (habit.type === 'positive') {
              try {
                const checkIns = await getCheckIns(habit.id);
                const todayCheckIn = checkIns.find(
                  (c) => c.date === today && c.completed === true
                );
                if (todayCheckIn) {
                  continue; // Already checked in, skip notification
                }
              } catch (error) {
                console.error('Error checking check-ins:', error);
              }
            }

            // Show reminder notification
            if (habit.type === 'positive') {
              toast.info(`Time to perform ${habit.name}!`, {
                description: `Reminder: ${habit.motivation || 'Stay consistent!'}`,
                duration: 5000,
              });
            } else {
              toast.warning(`Remember: Avoid ${habit.name}!`, {
                description: habit.motivation || 'You can do this!',
                duration: 5000,
              });
            }
          }
        }

        // Check confirmation dialog for break habits
        if (
          habit.type === 'negative' &&
          habit.confirmationTime &&
          habit.confirmationTime === currentTime
        ) {
          // Only show if not already confirmed today
          if (!confirmedHabitsRef.current.has(`${habit.id}-${today}`)) {
            try {
              const checkIns = await getCheckIns(habit.id);
              const todayCheckIn = checkIns.find((c) => c.date === today);
              if (!todayCheckIn) {
                // Mark as confirmed to prevent duplicate dialogs
                confirmedHabitsRef.current.add(`${habit.id}-${today}`);
                onConfirmationNeeded(habit);
              }
            } catch (error) {
              console.error('Error checking check-ins for confirmation:', error);
            }
          }
        }
      }
    };

    // Check immediately, then every minute
    checkNotifications();
    intervalRef.current = setInterval(checkNotifications, 60000); // Check every minute

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [habits, user, onConfirmationNeeded]);
};

