import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface HelpDialogsProps {
  generalHelpOpen: boolean;
  setGeneralHelpOpen: (open: boolean) => void;
  notificationsHelpOpen: boolean;
  setNotificationsHelpOpen: (open: boolean) => void;
  analyticsHelpOpen: boolean;
  setAnalyticsHelpOpen: (open: boolean) => void;
  rewardsHelpOpen: boolean;
  setRewardsHelpOpen: (open: boolean) => void;
}

const HelpDialogs = ({
  generalHelpOpen,
  setGeneralHelpOpen,
  notificationsHelpOpen,
  setNotificationsHelpOpen,
  analyticsHelpOpen,
  setAnalyticsHelpOpen,
  rewardsHelpOpen,
  setRewardsHelpOpen,
}: HelpDialogsProps) => {
  return (
    <>
      {/* General Help Dialog */}
      <Dialog open={generalHelpOpen} onOpenChange={setGeneralHelpOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">General Help</DialogTitle>
            <DialogDescription className="text-base mt-2">
              Learn how to use the app to build good habits and break bad ones.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            <section>
              <h3 className="text-lg font-semibold mb-2">Building a New Habit</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Click "New Habit" button on the dashboard</li>
                <li>Select "Build a Habit" as the habit type</li>
                <li>Choose a category (Health, Productivity, Hobbies, or Chores)</li>
                <li>Enter a name and description for your habit</li>
                <li>Set your schedule type (Daily, Weekly, or Monthly)</li>
                <li>Add reminder times throughout the day (up to 10 reminders)</li>
                <li>Add optional trigger or motivation message</li>
                <li>Click "Create Habit" to save</li>
                <li>Use the "Check In" button on the habit card to mark completion</li>
              </ol>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Breaking a Bad Habit</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Click "New Habit" button on the dashboard</li>
                <li>Select "Break a Habit" as the habit type</li>
                <li>Choose a category and enter name/description</li>
                <li>Set your schedule type and reminder times</li>
                <li>Set an "End of Day Confirmation Time" (when you'll confirm if you avoided it)</li>
                <li>Click "Create Habit" to save</li>
                <li>At the confirmation time, you'll receive a dialog asking if you avoided the habit</li>
                <li>Select "Yes, I Avoided It" or "No, I Gave In"</li>
              </ol>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Reminders</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Reminders help you stay on track with your habits. You can set up to 10 reminder times throughout the day.
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Reminders appear as toast notifications at the specified times</li>
                <li>For build habits: reminders appear unless you've already checked in</li>
                <li>For break habits: reminders always appear to help you stay strong</li>
                <li>Reminders only show on scheduled days (respects weekly/monthly schedules)</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Check-in Button</h3>
              <p className="text-sm text-muted-foreground mb-2">
                The check-in button allows you to mark your habit as completed for the day.
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Available for build habits only</li>
                <li>Changes from "Check In" to "Checked In" after clicking</li>
                <li>Remains checked in for the entire day (resets at midnight)</li>
                <li>Earns points and maintains your streak when completed</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Analytics Button</h3>
              <p className="text-sm text-muted-foreground mb-2">
                View detailed analytics about your habit performance.
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Click "Analytics" button on any habit card</li>
                <li>View longest streak, average streak, and completion rate</li>
                <li>See a calendar view with completed and missed days</li>
                <li>Track your progress over time</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Notes Button</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Add notes to track additional information about your habits.
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Click the notes icon on habit cards to add or view notes</li>
                <li>Keep track of important details or observations</li>
                <li>Helpful for reviewing your habit journey</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Rewards System</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Earn points, maintain streaks, and unlock badges as you progress.
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Points are earned for completing habits</li>
                <li>Penalties may apply for missing scheduled days</li>
                <li>Streaks track consecutive completion days</li>
                <li>Badges are earned at milestone achievements</li>
                <li>See "Rewards & Badges" help section for more details</li>
              </ul>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notifications & Check-in Help Dialog */}
      <Dialog open={notificationsHelpOpen} onOpenChange={setNotificationsHelpOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Notifications & Check-in Help</DialogTitle>
            <DialogDescription className="text-base mt-2">
              Understand how notifications and check-in features work.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            <section>
              <h3 className="text-lg font-semibold mb-2">How Notifications Work</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Notifications are in-app toast messages that appear at your set reminder times.
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Notifications appear as toast messages at the top or bottom of the screen</li>
                <li>They only work when the browser/app is open (prototype limitation)</li>
                <li>Notifications check every minute for scheduled reminder times</li>
                <li>They automatically dismiss after a few seconds or can be manually closed</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">When Notifications Appear</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><strong>Build Habits:</strong> Show at reminder times unless you've already checked in that day</li>
                <li><strong>Break Habits:</strong> Always show at reminder times to help you stay strong</li>
                <li><strong>Scheduled Days:</strong> Only appear on days when your habit is scheduled</li>
                <li><strong>Confirmation Dialog:</strong> For break habits, appears once at your set confirmation time</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">How Check-in Works</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><strong>Build Habits:</strong> Click "Check In" button on the habit card</li>
                <li>Button changes to "Checked In" and becomes disabled</li>
                <li>Status persists for the entire day (resets at midnight)</li>
                <li>Cannot undo a check-in once completed</li>
                <li><strong>Break Habits:</strong> No check-in button - only confirmation dialog at end of day</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">When Features Don't Work</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><strong>Browser Closed:</strong> Notifications won't appear when the browser is closed</li>
                <li><strong>Missed Notifications:</strong> Notifications from when the app was closed won't show later</li>
                <li><strong>Non-Scheduled Days:</strong> Notifications won't appear on days when your habit isn't scheduled</li>
                <li><strong>Already Checked In:</strong> Build habit reminders won't show if already checked in</li>
                <li><strong>Past Midnight:</strong> Check-in status resets at midnight, allowing new check-ins</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Suggestions</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Set multiple reminder times throughout the day for better consistency</li>
                <li>Keep the browser/app open during your active habit times</li>
                <li>Check in as soon as you complete your habit for better tracking</li>
                <li>For break habits, set confirmation time at end of day (e.g., 21:00)</li>
                <li>Use reminders strategically - too many can be overwhelming</li>
                <li>Combine reminders with your daily routine for better habit formation</li>
              </ul>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      {/* Analytics Help Dialog */}
      <Dialog open={analyticsHelpOpen} onOpenChange={setAnalyticsHelpOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Analytics Help</DialogTitle>
            <DialogDescription className="text-base mt-2">
              Understand how your habit analytics are calculated and displayed.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            <section>
              <h3 className="text-lg font-semibold mb-2">Available Analytics</h3>
              <p className="text-sm text-muted-foreground mb-2">
                The analytics modal shows three key metrics for each habit:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><strong>Longest Streak:</strong> The maximum consecutive days you've completed the habit</li>
                <li><strong>Average Streak:</strong> The average length of all your completion streaks</li>
                <li><strong>Completion Rate:</strong> Percentage of scheduled days you've completed the habit</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">How Longest Streak is Calculated</h3>
              <p className="text-sm text-muted-foreground mb-2">
                The longest streak is the maximum number of consecutive days you've completed the habit.
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Only counts completed check-ins (marked as completed: true)</li>
                <li>Days must be consecutive (no gaps)</li>
                <li>Resets when you miss a scheduled day</li>
                <li>Shows "0" if no check-ins exist</li>
                <li>Calculated for all time, up to today</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">How Average Streak is Calculated</h3>
              <p className="text-sm text-muted-foreground mb-2">
                The average streak is the average length of all your completion streaks.
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Finds all streaks in your check-in history</li>
                <li>Calculates the average length of these streaks</li>
                <li>Rounded to 1 decimal place</li>
                <li>Shows "0" if no streaks exist</li>
                <li>Helps you understand your overall consistency</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">How Completion Rate is Calculated</h3>
              <p className="text-sm text-muted-foreground mb-2">
                The completion rate shows what percentage of scheduled days you've completed.
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Formula: (Completed check-ins / Total scheduled days) × 100</li>
                <li>Only counts scheduled days (respects daily/weekly/monthly schedule)</li>
                <li>Only counts days from when the habit was created</li>
                <li>Rounded to 1 decimal place</li>
                <li>Shows "0%" if no check-ins exist</li>
                <li>Shows "100%" if all scheduled days were completed</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Calendar View</h3>
              <p className="text-sm text-muted-foreground mb-2">
                The calendar shows a visual representation of your habit performance over time.
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><strong>Green dots:</strong> Days when you completed the habit</li>
                <li><strong>Red dots:</strong> Days when you missed the habit</li>
                <li><strong>Greyed out:</strong> Days when the habit wasn't scheduled</li>
                <li>Scroll through months to see historical data</li>
                <li>Only shows data for scheduled days</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Understanding Your Data</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><strong>High completion rate + Long streaks:</strong> Great consistency!</li>
                <li><strong>Low completion rate:</strong> Consider adjusting schedule or reminders</li>
                <li><strong>Many short streaks:</strong> Focus on building consistency</li>
                <li><strong>Consistent pattern:</strong> Look for days of week when you struggle</li>
                <li>Use analytics to identify patterns and improve your habits</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Tips for Improving Analytics</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Check in consistently every scheduled day</li>
                <li>Set realistic schedules (don't overcommit)</li>
                <li>Use reminders to help maintain consistency</li>
                <li>Review analytics regularly to track progress</li>
                <li>Adjust your schedule if completion rate is consistently low</li>
                <li>Focus on building longer streaks gradually</li>
              </ul>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rewards & Badges Help Dialog */}
      <Dialog open={rewardsHelpOpen} onOpenChange={setRewardsHelpOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Rewards & Badges Help</DialogTitle>
            <DialogDescription className="text-base mt-2">
              Learn about the reward system, points, penalties, and badges.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            <section>
              <h3 className="text-lg font-semibold mb-2">Reward System Overview</h3>
              <p className="text-sm text-muted-foreground mb-2">
                The app uses a points-based reward system to motivate habit completion and consistency.
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Points are earned for completing habits on scheduled days</li>
                <li>Penalties may apply for missing scheduled days</li>
                <li>Points accumulate over time to track your overall progress</li>
                <li>Each habit tracks its own cumulative points</li>
                <li>User account tracks total points across all habits</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">How Points Are Earned</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><strong>Build Habits:</strong> Earn points when you check in and complete the habit</li>
                <li><strong>Break Habits:</strong> Earn points when you confirm you avoided the habit (at end of day)</li>
                <li>Points vary based on account age (longer accounts earn more points)</li>
                <li>Point values increase with consistency and streak length</li>
                <li>Points are added to both habit total and user total</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">How Penalties Work</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><strong>Build Habits:</strong> Points may be deducted for missing scheduled days</li>
                <li><strong>Break Habits:</strong> Points are deducted when you confirm you gave in (slipped)</li>
                <li>Penalty amounts are typically smaller than reward amounts</li>
                <li>Penalties help maintain accountability</li>
                <li>Missing non-scheduled days doesn't result in penalties</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Point Tiers & Structure</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Point values vary based on account age and consistency:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><strong>New Accounts (0-30 days):</strong> Base point values</li>
                <li><strong>Established Accounts (31-90 days):</strong> Increased point values</li>
                <li><strong>Veteran Accounts (90+ days):</strong> Highest point values</li>
                <li>Longer streaks may result in bonus points</li>
                <li>Point structure encourages long-term commitment</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Badge System Overview</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Badges are special achievements unlocked at milestone streaks.
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Badges are earned based on your current streak (across all habits)</li>
                <li>Each badge represents a significant milestone</li>
                <li>Badges are permanent achievements once earned</li>
                <li>Earning a badge shows a celebration animation</li>
                <li>View all your badges on the dashboard</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">How to Earn Badges</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Maintain a current streak (consecutive days of habit completion)</li>
                <li>Current streak is calculated across all your active habits</li>
                <li>Reach milestone streak lengths to unlock badges</li>
                <li>Streak resets if you miss a scheduled day for any habit</li>
                <li>Focus on consistency across all habits to earn badges faster</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Badge Milestones</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Badges are earned at the following streak milestones:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><strong>10 days:</strong> Bronze badge 🥉</li>
                <li><strong>15 days:</strong> Silver badge 🥈</li>
                <li><strong>30 days:</strong> Gold badge 🥇</li>
                <li><strong>75 days:</strong> Diamond badge 💎</li>
                <li><strong>150 days:</strong> Crown badge 👑</li>
                <li>More badges may be added in future updates</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Tips for Maximizing Rewards</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Complete habits on scheduled days consistently</li>
                <li>Maintain long streaks across all your habits</li>
                <li>Don't miss scheduled days to avoid penalties</li>
                <li>Set realistic schedules you can maintain</li>
                <li>Use reminders to help you remember</li>
                <li>Focus on consistency over quantity</li>
                <li>Celebrate your badge achievements!</li>
              </ul>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HelpDialogs;

