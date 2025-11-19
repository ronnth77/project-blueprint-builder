# Schedule Type & Points System Implementation Plan

## Overview
This document outlines the implementation of two major features:
1. **Schedule Type Selection** - Allow users to set habits as Daily, Weekly, or Monthly with day selection
2. **Points Display & Break Habits Rewards** - Show cumulative points per habit on cards and extend reward system to break habits

---

## Part 1: Schedule Type Selection

### 1.1 Update Habit Type Definition
- **File**: `src/types/index.ts`
- **Change**: Update `BaseHabit.schedule` to use the `Schedule` interface instead of hardcoded type
  - Change from: `schedule: { time: string; frequency: 'daily' }`
  - Change to: `schedule: Schedule`
  - This allows `daysOfWeek` and `daysOfMonth` to be properly stored

### 1.2 Create Schedule Type Selector Component
- **File**: `src/components/ScheduleTypeSelector.tsx` (new)
- **Features**:
  - Dropdown/Select component with options: Daily, Weekly, Monthly
  - Default: Daily
  - When Weekly selected: Show 7 day buttons (Mon-Sun) - allow multiple selection
  - When Monthly selected: Show compact 31-day calendar grid - allow multiple selection
  - Validation: At least one day must be selected for weekly/monthly

### 1.3 Update Create Habit Page
- **File**: `src/pages/CreateHabit.tsx`
- **Changes**:
  - Add Schedule Type selector
  - Show day selection UI conditionally based on selected type
  - Update form submission to include:
    - `schedule.frequency`: 'daily' | 'weekly' | 'monthly'
    - `schedule.daysOfWeek`: number[] (0-6, Sunday=0) - for weekly
    - `schedule.daysOfMonth`: number[] (1-31) - for monthly

### 1.4 Update Edit Habit Page
- **File**: `src/pages/EditHabit.tsx`
- **Changes**:
  - Add Schedule Type selector (pre-populated with existing value)
  - Show day selection UI with existing selections highlighted
  - Allow changing schedule type and days

### 1.5 Update Calendar/Analytics Display
- **Files**: `src/components/AnalyticsModal.tsx`, `src/components/calendar/StreakCalendar.tsx`
- **Changes**:
  - Ensure non-scheduled days are shown as grey/white (not scheduled)
  - Calendar already handles this via `isScheduledDay()` function
  - Verify it works correctly for weekly/monthly schedules

### 1.6 Update Check-in Logic
- **File**: `src/services/mockDataService.ts`
- **Changes**:
  - Ensure check-ins respect schedule frequency
  - Only allow check-ins on scheduled days (or show warning if attempted on non-scheduled day)

---

## Part 2: Points Display & Break Habits Rewards

### 2.1 Update Habit Type Definition
- **File**: `src/types/index.ts`
- **Change**: Add `totalPointsEarned: number` to `BaseHabit` interface
  - Already included in the schedule update above
  - This field tracks cumulative points earned by each individual habit

### 2.2 Create Break Habits Reward Service
- **File**: `src/services/breakHabitRewardService.ts` (new)
- **Functions**:
  - `updateBreakHabitRewards()` - Similar to `updateUserRewards` but for break habits
  - Logic:
    - When `completed: true` (user avoided the behavior) → Earn points (same as positive habits)
    - When `completed: false` (user gave in) → Deduct points (penalty)
  - Update habit's `totalPointsEarned`
  - Update user's `totalPoints`
  - Keep logic separated from positive habits as requested

### 2.3 Update Reward Service for Positive Habits
- **File**: `src/services/rewardService.ts`
- **Changes**:
  - Modify `updateUserRewards()` to also update `habit.totalPointsEarned`
  - Track points per habit in addition to global user points
  - Ensure penalty is applied when positive habit is missed (already implemented)

### 2.4 Update Check-in Handler
- **File**: `src/pages/Dashboard.tsx`
- **Changes**:
  - For positive habits: Call `updateUserRewards()` (updated to track per-habit points)
  - For break habits: Call `updateBreakHabitRewards()`
  - Both should update the habit's `totalPointsEarned` field

### 2.5 Update Habit Card Display
- **File**: `src/components/HabitCard.tsx`
- **Changes**:
  - Add points badge next to streak display
  - Format: `🔥 5 day streak • 150 pts` or similar
  - Show cumulative total points for that habit
  - Style: Small badge/chip with points value

### 2.6 Initialize Points for Existing Habits
- **File**: `src/services/mockDataService.ts`
- **Changes**:
  - When loading habits, ensure `totalPointsEarned` exists (default to 0)
  - Migration: Set existing habits to 0 points (as per requirement)

### 2.7 Update Habit Creation
- **File**: `src/services/mockDataService.ts` - `createHabit()`
- **Changes**:
  - Initialize `totalPointsEarned: 0` for new habits

---

## Implementation Details

### Schedule Type Selector UI

**Weekly Selection:**
```
Schedule Type: [Daily ▼]
┌─────────────────────────────────┐
│ Select Days:                    │
│ [Mon] [Tue] [Wed] [Thu] [Fri]   │
│ [Sat] [Sun]                      │
└─────────────────────────────────┘
```

**Monthly Selection:**
```
Schedule Type: [Monthly ▼]
┌─────────────────────────────────┐
│ Select Days (1-31):              │
│  1  2  3  4  5  6  7             │
│  8  9 10 11 12 13 14             │
│ 15 16 17 18 19 20 21             │
│ 22 23 24 25 26 27 28             │
│ 29 30 31                         │
└─────────────────────────────────┘
```

### Points Display on Habit Card

**Current:**
```
🔥 5 day streak
```

**Updated:**
```
🔥 5 day streak • 150 pts
```

Or as a separate badge:
```
🔥 5 day streak
⭐ 150 pts
```

### Break Habits Reward Logic

```typescript
// Break habit check-in
if (habit.type === 'negative') {
  if (completed) {
    // User avoided the behavior → Reward points
    pointsEarned = calculatePoints(user, habitId, true);
  } else {
    // User gave in → Penalty
    pointsEarned = calculatePoints(user, habitId, false); // Returns negative
  }
  
  // Update habit points
  habit.totalPointsEarned += pointsEarned;
  user.totalPoints += pointsEarned;
}
```

---

## Files to Create

1. `src/components/ScheduleTypeSelector.tsx` - Schedule type and day selection component
2. `src/services/breakHabitRewardService.ts` - Reward logic for break habits

## Files to Modify

1. `src/types/index.ts` - Add `totalPointsEarned` to BaseHabit
2. `src/pages/CreateHabit.tsx` - Add schedule type selector
3. `src/pages/EditHabit.tsx` - Add schedule type selector
4. `src/services/rewardService.ts` - Update to track per-habit points
5. `src/services/mockDataService.ts` - Initialize points, update check-in logic
6. `src/components/HabitCard.tsx` - Display points badge
7. `src/pages/Dashboard.tsx` - Handle break habit rewards

## Edge Cases & Validation

### Schedule Type
- ✅ At least one day must be selected for weekly/monthly
- ✅ Monthly: Handle months with <31 days (just skip invalid days)
- ✅ Calendar display: Non-scheduled days shown as grey/white
- ✅ Check-in validation: Warn if trying to check in on non-scheduled day

### Points System
- ✅ Initialize all existing habits to 0 points
- ✅ New habits start at 0 points
- ✅ Points can go negative (if penalties exceed rewards)
- ✅ Both positive and break habits use same POINTS_CONFIG tiers
- ✅ Break habits: completed=true = reward, completed=false = penalty

## Testing Checklist

- [ ] Create daily habit - works as before
- [ ] Create weekly habit - can select multiple days
- [ ] Create monthly habit - can select multiple days
- [ ] Edit habit - can change schedule type
- [ ] Calendar shows correct scheduled days
- [ ] Analytics respects schedule type
- [ ] Positive habit check-in earns points
- [ ] Positive habit miss deducts points
- [ ] Break habit avoided earns points
- [ ] Break habit gave in deducts points
- [ ] Points display on habit card
- [ ] Points accumulate correctly per habit
- [ ] User total points update correctly

