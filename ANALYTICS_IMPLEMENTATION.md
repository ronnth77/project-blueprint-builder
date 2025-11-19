# Analytics Tab Implementation Plan

## Overview
Transform the existing Calendar button/modal into an Analytics button/modal that displays comprehensive habit analytics including longest streak, average streak, completion rate, and the existing calendar visualization.

## Changes Summary

### 1. Button Update in HabitCard Component
- **File**: `src/components/HabitCard.tsx`
- **Change**: Rename "Calendar" button text to "Analytics"
- **Location**: Line ~199, in the expanded actions section
- **Details**: 
  - Change button text from "Calendar" to "Analytics"
  - Keep the CalendarIcon (or optionally change to BarChart3/TrendingUp icon)
  - Update state variable name from `calendarModalOpen` to `analyticsModalOpen` for clarity

### 2. Modal Component Transformation
- **File**: `src/components/CalendarModal.tsx` → Rename to `src/components/AnalyticsModal.tsx`
- **Changes**:
  - Rename component from `CalendarModal` to `AnalyticsModal`
  - Update modal title to "Habit Analytics"
  - Add three metric boxes at the top showing:
    1. **Longest Streak** (in days)
    2. **Average Streak** (in days, rounded to 1 decimal)
    3. **Completion Rate** (as percentage)
  - Keep existing calendar visualization in the center
  - Keep legend at the bottom

### 3. Analytics Calculation Functions
- **File**: Create new utility file `src/services/analyticsService.ts` or add to existing service
- **Functions to implement**:

#### `calculateLongestStreak(checkIns: HabitCheckIn[]): number`
- Find all historical streaks (including broken ones)
- Return the maximum streak length
- Algorithm:
  1. Sort check-ins by date (oldest to newest)
  2. Filter only completed check-ins
  3. Group consecutive days into streaks
  4. Return the maximum streak length
  5. Return 0 if no check-ins

#### `calculateAverageStreak(checkIns: HabitCheckIn[]): number`
- Calculate average of all streaks in history
- Include current streak in calculation
- If only one streak exists, use that as the average
- Round to 1 decimal place
- Algorithm:
  1. Find all streaks (same as longest streak)
  2. Calculate average: sum of all streaks / number of streaks
  3. If no streaks, return 0
  4. Round to 1 decimal

#### `calculateCompletionRate(checkIns: HabitCheckIn[], habit: Habit): number`
- Calculate: (completed check-ins / total scheduled days) * 100
- Only count days up to today (not future days)
- Consider habit schedule frequency (daily/weekly/monthly)
- Algorithm:
  1. Get habit creation date
  2. Calculate total scheduled days from creation to today based on schedule frequency
  3. Count completed check-ins
  4. Formula: (completed / total scheduled) * 100
  5. Round to 1 decimal
  6. Return 0 if no scheduled days yet

### 4. Layout Structure

```
┌─────────────────────────────────────┐
│      Habit Analytics (Title)        │
├─────────────────────────────────────┤
│  ┌──────┐  ┌──────┐  ┌──────┐       │
│  │Longest│  │ Avg  │  │Completion│  │
│  │Streak │  │Streak│  │  Rate   │  │
│  └──────┘  └──────┘  └──────┘       │
├─────────────────────────────────────┤
│                                     │
│         Calendar View               │
│      (Existing Implementation)      │
│                                     │
├─────────────────────────────────────┤
│  [Completed] [Missed] (Legend)      │
└─────────────────────────────────────┘
```

### 5. Metric Boxes Design
- Three equal-width boxes in a row
- Each box displays:
  - Metric label (e.g., "Longest Streak")
  - Large number value
  - Unit (e.g., "days" or "%")
- Responsive: Stack vertically on mobile
- Styling: Use Card component or similar for consistency

### 6. Edge Cases Handling

#### No Check-ins
- Longest Streak: 0
- Average Streak: 0
- Completion Rate: 0%

#### Habit Created Today, Completed Today
- Completion Rate: 100% (as specified)

#### Single Streak
- Average Streak = that single streak value

#### No Scheduled Days Yet
- Completion Rate: 0%

## Implementation Steps

1. **Create analytics calculation functions**
   - Implement `calculateLongestStreak()`
   - Implement `calculateAverageStreak()`
   - Implement `calculateCompletionRate()`
   - Add helper functions for streak detection

2. **Update HabitCard component**
   - Change button text to "Analytics"
   - Update state variable name
   - Update modal component reference

3. **Transform CalendarModal to AnalyticsModal**
   - Rename file and component
   - Add metric boxes at top
   - Integrate analytics calculations
   - Update title to "Habit Analytics"
   - Ensure calendar still works

4. **Update imports**
   - Update import in `HabitCard.tsx`
   - Check for any other files importing `CalendarModal`

5. **Testing**
   - Test with habits that have various check-in patterns
   - Test edge cases (no check-ins, single check-in, etc.)
   - Verify calculations are correct
   - Test responsive layout

## Files to Modify

1. `src/components/HabitCard.tsx` - Update button text and modal reference
2. `src/components/CalendarModal.tsx` - Transform to AnalyticsModal
3. `src/services/analyticsService.ts` - New file for analytics calculations (or add to existing service)

## Files to Create

1. `src/services/analyticsService.ts` - Analytics calculation utilities

## Technical Details

### Streak Detection Algorithm
```typescript
// Pseudo-code for finding all streaks
1. Sort completed check-ins by date (oldest first)
2. Group consecutive days:
   - Start with first date
   - If next date is exactly 1 day later, continue streak
   - If gap > 1 day, end current streak, start new one
3. Return array of all streak lengths
```

### Completion Rate Calculation
```typescript
// Pseudo-code
1. Get habit.createdAt date
2. Calculate days from createdAt to today
3. Based on schedule.frequency:
   - daily: all days count
   - weekly: only scheduled daysOfWeek count
   - monthly: only scheduled daysOfMonth count
4. Count completed check-ins
5. Return (completed / total scheduled) * 100
```

## Design Considerations

- Metric boxes should be visually prominent but not overwhelming
- Use consistent spacing and typography
- Ensure accessibility (proper labels, contrast)
- Mobile-first responsive design
- Maintain existing calendar functionality

