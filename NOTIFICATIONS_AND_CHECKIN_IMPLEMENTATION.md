# Notifications and Check-In System Implementation Plan

## Overview
This document outlines the implementation of in-app notifications/reminders and check-in system improvements, including removal of timer type functionality.

---

## Part 1: Notifications and Reminders System

### 1.1 Notification Service
- **File**: `src/services/notificationService.ts` (new or update existing)
- **Features**:
  - Show in-app toast notifications at reminder times
  - Only show notifications on scheduled days (for weekly/monthly habits)
  - Only work when browser/app is open (prototype limitation)
  - Don't show missed notifications from when app was closed
  - Different messages for build vs break habits

### 1.2 Notification Messages
- **Build Habits**: "Time to perform [Habit Name]!"
- **Break Habits**: "Remember: Avoid [Habit Name] today!"
- **Break Habits (frequent reminders)**: Show all reminder times throughout the day

### 1.3 Notification Timing Logic
- Show notifications exactly at reminder times
- For build habits: Don't show if user already checked in that day
- For break habits: Always show reminders (even if confirmed earlier, as they can slip anytime)
- Only show on scheduled days (respect schedule type: daily/weekly/monthly)
- Check if browser/app is open before showing notification

### 1.4 Notification Component
- **File**: `src/components/NotificationToast.tsx` (new or use existing toast system)
- **Type**: Toast notification (can be upgraded to modal later)
- **Behavior**:
  - Appears at reminder time
  - Can be dismissed by user
  - Auto-dismiss after a few seconds (optional)

---

## Part 2: Break Habits Confirmation System

### 2.1 Remove Check-In Button for Break Habits
- **File**: `src/components/HabitCard.tsx`
- **Change**: Hide/remove "Check In" button for break habits (type === 'negative')
- **Logic**: Break habits can ONLY be checked in via confirmation popup

### 2.2 Add Confirmation Time Field
- **File**: `src/types/index.ts`
- **Change**: Add `confirmationTime?: string` to `BaseHabit` interface
  - Format: "HH:MM" (24-hour format)
  - Optional field (only for break habits)

### 2.3 Confirmation Time Input in Forms
- **Files**: `src/pages/CreateHabit.tsx`, `src/pages/EditHabit.tsx`
- **Change**: 
  - Add "Confirmation Time" input field
  - Only show for break habits (when type === 'negative')
  - Time picker input (HH:MM format)
  - Label: "End of Day Confirmation Time"
  - Description: "Time to confirm if you avoided this habit today"

### 2.4 Confirmation Dialog Component
- **File**: `src/components/ConfirmationDialog.tsx` (new)
- **Features**:
  - Modal dialog that blocks interaction until answered
  - Habit name display
  - Question: "Did you avoid [Habit Name] today?"
  - Two buttons: "Yes" (avoided) and "No" (slipped)
  - Cannot be dismissed without answering

### 2.5 Confirmation Dialog Logic
- **File**: `src/services/breakHabitRewardService.ts` (update) or new service
- **When user clicks "Yes"** (avoided):
  - Create check-in with `completed: true`
  - Award points (using `updateBreakHabitRewards`)
  - Mark as completed for the day
  - Close dialog

- **When user clicks "No"** (slipped):
  - Create check-in with `completed: false`
  - Deduct points (penalty - using `updateBreakHabitRewards`)
  - Mark as missed for the day
  - Close dialog

### 2.6 Schedule Confirmation Dialog
- **File**: `src/services/notificationService.ts` or scheduler
- **Logic**:
  - Check all break habits for confirmation times
  - Show confirmation dialog at scheduled confirmation time
  - Only show once per day per habit
  - Only show on scheduled days
  - Only show if browser/app is open

---

## Part 3: Build Habits Button Enhancement

### 3.1 Update Button Text Flow
- **File**: `src/components/HabitCard.tsx`
- **Change**: 
  - Initial state: Button text = "Check In"
  - After clicking: Button text = "Checked In"
  - Button should be disabled/greyed out after clicking
  - Show checkmark icon (optional)

### 3.2 Button State Management
- **File**: `src/components/HabitCard.tsx`
- **Logic**:
  - Check if habit has check-in for today
  - If checked in: Show "Checked In" (disabled)
  - If not checked in: Show "Check In" (enabled)
  - Persist state for entire day (reset at midnight)
  - No undo functionality

### 3.3 Check-In Action
- **File**: `src/pages/Dashboard.tsx` (update `handleCheckIn`)
- **Change**:
  - Immediately change button to "Checked In" state
  - Create check-in record
  - Award points (for build habits)
  - Refresh habit card to show updated state

---

## Part 4: Remove Timer Type Functionality

### 4.1 Update Types
- **File**: `src/types/index.ts`
- **Changes**:
  - Remove `TimerHabit` interface
  - Remove `HabitTimeType` type
  - Change `Habit` type to only `CheckInHabit`
  - Remove timer-related fields from `BaseHabit`:
    - `duration: number`
    - `isStrict: boolean`
    - `timerState?: {...}`

### 4.2 Migrate Existing Timer Habits
- **File**: `src/services/mockDataService.ts`
- **Function**: `migrateTimerHabitsToCheckIn()` (new)
- **Logic**:
  - Convert all existing timer habits to check-in habits
  - Remove `duration`, `isStrict`, `timerState` fields
  - Set `timeType: 'check-in'`
  - Save updated habits

### 4.3 Update Create Habit Form
- **File**: `src/pages/CreateHabit.tsx`
- **Changes**:
  - Remove "Time Type" radio group section
  - Remove timer-specific fields (duration, strict mode)
  - Remove timer-related form state
  - Always create as check-in type

### 4.4 Update Edit Habit Form
- **File**: `src/pages/EditHabit.tsx`
- **Changes**:
  - Remove "Time Type" radio group section
  - Remove timer-specific fields (duration, strict mode)
  - Remove timer-related form state
  - Always save as check-in type

### 4.5 Update Habit Card Display
- **File**: `src/components/HabitCard.tsx`
- **Changes**:
  - Remove timer badge/icon (e.g., "30m" duration badge)
  - Remove timer-related UI elements

### 4.6 Update Habit Creation Service
- **File**: `src/services/mockDataService.ts`
- **Changes**:
  - `createHabit()`: Always create as check-in type
  - Remove timer-specific logic
  - Remove duration and isStrict parameters

---

## Part 5: Notification Scheduler

### 5.1 Schedule Notification Service
- **File**: `src/services/notificationScheduler.ts` (new)
- **Features**:
  - Check all active habits for reminder times
  - Only schedule notifications for scheduled days (respect schedule type)
  - For build habits: Skip if already checked in
  - For break habits: Always show reminders
  - Only schedule if browser/app is open

### 5.2 Notification Timing
- Check reminder times every minute (or use setInterval)
- Compare current time with reminder times
- Show notification if:
  - Current time matches reminder time (±1 minute window)
  - Habit is scheduled for today
  - Browser/app is open
  - (For build habits) Not already checked in

### 5.3 Confirmation Dialog Scheduler
- Check confirmation times for break habits
- Show confirmation dialog if:
  - Current time matches confirmation time (±1 minute window)
  - Habit is scheduled for today
  - Browser/app is open
  - Not already confirmed today

---

## Implementation Details

### Notification Service Structure
```typescript
// Check reminders every minute
setInterval(() => {
  const now = new Date();
  const currentTime = format(now, 'HH:mm');
  
  habits.forEach(habit => {
    // Check if scheduled for today
    if (!isScheduledDay(habit, now)) return;
    
    // Check reminder times
    habit.reminders.forEach(reminderTime => {
      if (reminderTime === currentTime) {
        // Build habit: skip if already checked in
        if (habit.type === 'positive' && isCheckedInToday(habit)) return;
        
        // Show notification
        showReminderNotification(habit);
      }
    });
    
    // Check confirmation time (break habits only)
    if (habit.type === 'negative' && habit.confirmationTime === currentTime) {
      if (!isConfirmedToday(habit)) {
        showConfirmationDialog(habit);
      }
    }
  });
}, 60000); // Check every minute
```

### Confirmation Dialog Component
```typescript
// Dialog that blocks interaction
// Shows: "Did you avoid [Habit Name] today?"
// Buttons: "Yes" (avoided) | "No" (slipped)
// Cannot close without answering
```

### Button State Logic
```typescript
// Check-in button for build habits
const isCheckedIn = checkIns.some(c => 
  c.habitId === habit.id && 
  c.date === today && 
  c.completed === true
);

// Button text
const buttonText = isCheckedIn ? 'Checked In' : 'Check In';

// Button disabled
const isDisabled = isCheckedIn;
```

---

## Files to Create

1. `src/components/ConfirmationDialog.tsx` - Confirmation dialog for break habits
2. `src/services/notificationScheduler.ts` - Scheduler for notifications and confirmations
3. `NOTIFICATIONS_AND_CHECKIN_IMPLEMENTATION.md` - This file

## Files to Modify

1. `src/types/index.ts` - Remove timer types, add confirmationTime
2. `src/components/HabitCard.tsx` - Remove check-in button for break habits, update button text flow
3. `src/pages/CreateHabit.tsx` - Remove timer UI, add confirmation time field
4. `src/pages/EditHabit.tsx` - Remove timer UI, add confirmation time field
5. `src/services/mockDataService.ts` - Remove timer creation logic, add migration function
6. `src/services/breakHabitRewardService.ts` - Update to handle confirmation dialog actions
7. `src/pages/Dashboard.tsx` - Update check-in handler for button state

## Files to Remove/Deprecate

- Timer-related components (if any exist)
- Timer-related services (if separate files)

---

## Edge Cases & Validation

### Notifications
- ✅ Don't show if user already checked in (build habits)
- ✅ Always show for break habits (even if confirmed)
- ✅ Only show on scheduled days
- ✅ Only show when browser is open
- ✅ Don't show missed notifications from closed app

### Confirmation Dialog
- ✅ Only for break habits
- ✅ Show once per day at confirmation time
- ✅ Block interaction until answered
- ✅ Create check-in record (yes/no)
- ✅ Award/deduct points appropriately

### Button State
- ✅ "Check In" → "Checked In" after clicking
- ✅ Persist for entire day
- ✅ Reset at midnight
- ✅ No undo

### Timer Removal
- ✅ Convert all existing timer habits
- ✅ Remove timer fields completely
- ✅ Remove timer UI from forms
- ✅ Remove timer badges from cards

---

## Testing Checklist

- [ ] Notifications show at reminder times
- [ ] Notifications only show on scheduled days
- [ ] Build habit notifications don't show if already checked in
- [ ] Break habit notifications always show
- [ ] Confirmation dialog shows at confirmation time
- [ ] Confirmation dialog blocks interaction
- [ ] "Yes" creates completed check-in and awards points
- [ ] "No" creates missed check-in and deducts points
- [ ] Check-in button changes from "Check In" to "Checked In"
- [ ] Button state persists for entire day
- [ ] Button resets at midnight
- [ ] Break habits don't have check-in button
- [ ] Timer type removed from create/edit forms
- [ ] Existing timer habits converted to check-in
- [ ] Timer badges removed from habit cards

