import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAllHabits, getCheckInForDate, createCheckIn } from '@/services/mockDataService';
import { Habit, HabitCategory, Badge } from '@/types';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Flame, TrendingUp, Award, Filter, Clock, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import HabitCard from '@/components/HabitCard';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { updateUserRewards, getNextBadgeMilestone } from '@/services/rewardService';
import { BadgeCelebration } from '@/components/BadgeCelebration';
import { Progress } from '@/components/ui/progress';

const Dashboard = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory | 'all' | 'upcoming'>('upcoming');
  const [celebrationBadge, setCelebrationBadge] = useState<Badge | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const today = format(new Date(), 'yyyy-MM-dd');

  const loadHabits = async () => {
    if (!user) return;
    
    try {
      const userHabits = await getAllHabits(user.id);
      setHabits(userHabits);
    } catch (error) {
      console.error('Error loading habits:', error);
      toast.error('Failed to load habits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHabits();
  }, [user]);

  const handleCheckIn = async (habitId: string) => {
    if (!user) return;

    try {
      const existingCheckIn = await getCheckInForDate(habitId, today);
      
      if (existingCheckIn) {
        toast.info('Already checked in today!');
        return;
      }

      // Create check-in
      await createCheckIn(habitId, user.id, {
        date: today,
        completed: true,
        completionPercentage: 100,
      });

      // Find the habit to check if it's positive or negative
      const habit = habits.find(h => h.id === habitId);
      const isPositive = habit?.type === 'positive';

      let pointsEarned = 0;
      let newBadges: any[] = [];
      let updatedUser = user;

      // Update rewards based on habit type
      if (isPositive && habit) {
        // Positive habit - use existing reward service
        const result = await updateUserRewards(user, habitId, true, true);
        updatedUser = result.user;
        pointsEarned = result.pointsEarned;
        newBadges = result.newBadges;
      } else if (habit && !isPositive) {
        // Break habit - use break habit reward service
        const { updateBreakHabitRewards } = await import('@/services/breakHabitRewardService');
        const result = await updateBreakHabitRewards(user, habit, true); // true = avoided the behavior
        updatedUser = result.user;
        pointsEarned = result.pointsEarned;
      }

      // Show success message with points
      if (pointsEarned > 0) {
        toast.success(`Check-in recorded! +${pointsEarned} points 🔥`);
      } else if (pointsEarned < 0) {
        toast.warning(`Check-in recorded! ${pointsEarned} points`);
      } else {
        toast.success('Check-in recorded! 🔥');
      }

      // Show badge celebration if earned
      if (newBadges.length > 0) {
        setCelebrationBadge(newBadges[0]);
        setShowCelebration(true);
      }

      // Update user context if user was updated
      if (updatedUser) {
        await refreshUser();
      }
      
      // Refresh habits
      await loadHabits();
    } catch (error) {
      console.error('Error checking in:', error);
      toast.error('Failed to check in');
    }
  };

  const totalStreak = habits.reduce((sum, habit) => sum + habit.streakCount, 0);
  const completedToday = habits.filter(h => h.lastCheckInDate === today).length;

  // Get upcoming habits (next 3 hours)
  const getUpcomingHabits = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    return habits.filter(habit => {
      const [habitHour, habitMinute] = habit.schedule.time.split(':').map(Number);
      const habitTimeInMinutes = habitHour * 60 + habitMinute;
      const timeDiff = habitTimeInMinutes - currentTimeInMinutes;
      
      // Show habits within next 3 hours (180 minutes) or that are happening now
      return timeDiff >= -30 && timeDiff <= 180;
    }).sort((a, b) => {
      const [aHour, aMinute] = a.schedule.time.split(':').map(Number);
      const [bHour, bMinute] = b.schedule.time.split(':').map(Number);
      return (aHour * 60 + aMinute) - (bHour * 60 + bMinute);
    });
  };

  // Filter habits by category
  const filteredHabits = selectedCategory === 'upcoming'
    ? getUpcomingHabits()
    : selectedCategory === 'all' 
      ? habits 
      : habits.filter(h => h.category === selectedCategory);

  const nextMilestone = getNextBadgeMilestone(user?.currentStreak || 0);
  const progressToNext = ((user?.currentStreak || 0) / nextMilestone) * 100;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-muted-foreground mt-1">
              {completedToday === 0 
                ? 'Time to build some habits today!'
                : `Great progress! ${completedToday} habit${completedToday === 1 ? '' : 's'} completed today.`
              }
            </p>
          </div>
          <Button onClick={() => navigate('/habits/create')} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            New Habit
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Flame className="mr-2 h-4 w-4 text-primary" />
                Total Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{totalStreak} days</div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <TrendingUp className="mr-2 h-4 w-4 text-success" />
                Active Habits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{habits.length}</div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Award className="mr-2 h-4 w-4 text-accent" />
                Total Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{user?.totalPoints || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Trophy className="mr-2 h-4 w-4 text-primary" />
                Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{user?.badges?.length || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Badge Progress */}
        {user && user.currentStreak > 0 && (
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Next Badge Progress</CardTitle>
                  <CardDescription>
                    {user.currentStreak}/{nextMilestone} days to next badge
                  </CardDescription>
                </div>
                <div className="text-4xl">
                  {nextMilestone === 10 ? '🥉' : nextMilestone === 15 ? '🥈' : nextMilestone === 30 ? '🥇' : nextMilestone === 75 ? '💎' : nextMilestone === 150 ? '👑' : '🏆'}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={progressToNext} className="h-3" />
            </CardContent>
          </Card>
        )}

        {/* Habits List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Your Habits</h2>
          </div>

          {/* Category Filter Tabs */}
          <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as any)} className="mb-6">
            <TabsList className="w-full justify-start flex-wrap h-auto gap-2 bg-transparent">
              <TabsTrigger value="upcoming" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Clock className="mr-2 h-4 w-4" />
                Upcoming
              </TabsTrigger>
              <TabsTrigger value="health" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                🏥 Health
              </TabsTrigger>
              <TabsTrigger value="productivity" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                ⚡ Work
              </TabsTrigger>
              <TabsTrigger value="hobbies" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                🎨 Hobbies
              </TabsTrigger>
              <TabsTrigger value="chores" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                🏠 Chores
              </TabsTrigger>
              <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Filter className="mr-2 h-4 w-4" />
                All
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {filteredHabits.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {selectedCategory === 'all' ? 'No habits yet' : `No ${selectedCategory} habits yet`}
                </h3>
                <p className="text-muted-foreground text-center mb-4">
                  {selectedCategory === 'all' 
                    ? 'Start building better habits by creating your first one'
                    : `Create a ${selectedCategory} habit to get started`
                  }
                </p>
                <Button onClick={() => navigate('/habits/create')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Habit
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredHabits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onCheckIn={handleCheckIn}
                  isCheckedInToday={habit.lastCheckInDate === today}
                  onUpdate={loadHabits}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <BadgeCelebration
        badge={celebrationBadge}
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
      />
    </div>
  );
};

export default Dashboard;
