import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAllHabits, getCheckInForDate, createCheckIn } from '@/services/mockDataService';
import { Habit } from '@/types';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Flame, TrendingUp, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import HabitCard from '@/components/HabitCard';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
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

      await createCheckIn(habitId, user.id, {
        date: today,
        completed: true,
        completionPercentage: 100,
      });

      toast.success('Great job! Check-in recorded', {
        icon: '🔥',
      });

      loadHabits();
    } catch (error) {
      console.error('Error checking in:', error);
      toast.error('Failed to check in');
    }
  };

  const totalStreak = habits.reduce((sum, habit) => sum + habit.streakCount, 0);
  const completedToday = habits.filter(h => h.lastCheckInDate === today).length;

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
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-muted-foreground mt-1">
              {completedToday === habits.length && habits.length > 0
                ? 'All habits completed today! 🎉'
                : `${completedToday} of ${habits.length} habits completed today`}
            </p>
          </div>
          <Button
            onClick={() => navigate('/habits/create')}
            size="lg"
            className="shadow-lg hover:shadow-xl transition-shadow"
          >
            <Plus className="mr-2 h-5 w-5" />
            New Habit
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Flame className="mr-2 h-4 w-4 text-secondary" />
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
                Reward Coins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{user?.rewardCoins || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Habits List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Your Habits</h2>
          </div>

          {habits.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No habits yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Start building better habits by creating your first one
                </p>
                <Button onClick={() => navigate('/habits/create')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Habit
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onCheckIn={handleCheckIn}
                  isCheckedInToday={habit.lastCheckInDate === today}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
