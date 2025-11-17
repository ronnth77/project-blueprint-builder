import { Habit } from '@/types';
import { toast } from 'sonner';

class ReminderService {
  private reminders: Map<string, NodeJS.Timeout> = new Map();

  scheduleReminder(habit: Habit) {
    // Clear existing reminders for this habit
    this.clearReminders(habit.id);

    if (!habit.reminders || habit.reminders.length === 0) return;

    habit.reminders.forEach((time, index) => {
      const [hours, minutes] = time.split(':').map(Number);
      const now = new Date();
      const reminderTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes,
        0
      );

      // If the time has already passed today, schedule for tomorrow
      if (reminderTime < now) {
        reminderTime.setDate(reminderTime.getDate() + 1);
      }

      const timeoutMs = reminderTime.getTime() - now.getTime();
      
      const timeout = setTimeout(() => {
        this.showReminder(habit);
        // Reschedule for next day
        this.scheduleReminder(habit);
      }, timeoutMs);

      this.reminders.set(`${habit.id}-${index}`, timeout);
    });
  }

  private showReminder(habit: Habit) {
    // Show in-app notification using toast
    toast(habit.name, {
      description: habit.motivation || 'Time to check in!',
      icon: habit.icon || (habit.timeType === 'check-in' ? '⚠️' : '⏰'),
      duration: 5000,
    });
  }

  clearReminders(habitId: string) {
    // Clear all reminders for a habit
    this.reminders.forEach((timeout, key) => {
      if (key.startsWith(habitId)) {
        clearTimeout(timeout);
        this.reminders.delete(key);
      }
    });
  }

  clearAllReminders() {
    this.reminders.forEach((timeout) => {
      clearTimeout(timeout);
    });
    this.reminders.clear();
  }
}

export const reminderService = new ReminderService();
