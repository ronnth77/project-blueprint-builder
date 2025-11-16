import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getHabitById, getCheckIns } from '@/services/mockDataService';
import { Habit, HabitCheckIn } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import StreakCalendar from '@/components/calendar/StreakCalendar';
import HabitNotes from '@/components/notes/HabitNotes';
import { toast } from 'sonner';

const HabitDetails = () => {
  const { habitId } = useParams<{ habitId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [checkIns, setCheckIns] = useState<HabitCheckIn[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHabitData = async () => {
    if (!habitId || !user) return;

    try {
      const [habitData, checkInData] = await Promise.all([
        getHabitById(habitId),
        getCheckIns(habitId),
      ]);

      if (!habitData) {
        toast.error('Habit not found');
        navigate('/dashboard');
        return;
      }

      setHabit(habitData);
      setCheckIns(checkInData);
    } catch (error) {
      console.error('Error loading habit data:', error);
      toast.error('Failed to load habit details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHabitData();
  }, [habitId, user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!habit) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted py-8">
      <div className="container max-w-4xl mx-auto p-4 space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="space-y-6">
          <StreakCalendar
            habitName={habit.name}
            checkIns={checkIns}
            streakCount={habit.streakCount}
          />

          <HabitNotes
            habitId={habit.id}
            habitName={habit.name}
            initialNotes={habit.notes}
            onNotesUpdate={loadHabitData}
          />
        </div>
      </div>
    </div>
  );
};

export default HabitDetails;
