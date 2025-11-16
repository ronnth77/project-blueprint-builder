import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { updateHabit } from '@/services/mockDataService';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface HabitNotesProps {
  habitId: string;
  habitName: string;
  initialNotes?: string;
  onNotesUpdate?: () => void;
}

const HabitNotes = ({ habitId, habitName, initialNotes = '', onNotesUpdate }: HabitNotesProps) => {
  const [notes, setNotes] = useState(initialNotes);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes]);

  // Auto-save with debounce
  useEffect(() => {
    if (notes === initialNotes) return;

    const timeoutId = setTimeout(async () => {
      setIsSaving(true);
      try {
        await updateHabit(habitId, { notes });
        setLastSaved(new Date());
        onNotesUpdate?.();
      } catch (error) {
        console.error('Error saving notes:', error);
        toast.error('Failed to save notes');
      } finally {
        setIsSaving(false);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [notes, habitId, initialNotes, onNotesUpdate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Notes for {habitName}</CardTitle>
        <CardDescription>
          {isSaving ? (
            'Saving...'
          ) : lastSaved ? (
            `Last saved: ${format(lastSaved, 'MMM d, yyyy h:mm a')}`
          ) : (
            'Add notes, reflections, or tips for this habit'
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Write your thoughts, progress, or strategies here..."
          className="min-h-[150px] resize-none"
        />
      </CardContent>
    </Card>
  );
};

export default HabitNotes;
