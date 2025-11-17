import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getHabitById, updateHabit } from '@/services/mockDataService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { Habit, HabitTimeType } from '@/types';

const EditHabit = () => {
  const { habitId } = useParams<{ habitId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [habit, setHabit] = useState<Habit | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'positive' as 'positive' | 'negative',
    category: 'productivity' as 'health' | 'chores' | 'hobbies' | 'productivity',
    time: '09:00',
    trigger: '',
    motivation: '',
    icon: '✅',
    timeType: 'check-in' as HabitTimeType,
    duration: 30,
    isStrict: false,
    reminders: [] as string[],
  });

  useEffect(() => {
    const loadHabit = async () => {
      if (!habitId) return;
      
      try {
        const habitData = await getHabitById(habitId);
        if (habitData) {
          setHabit(habitData);
          setFormData({
            name: habitData.name,
            description: habitData.description || '',
            type: habitData.type,
            category: habitData.category,
            time: habitData.schedule.time,
            trigger: habitData.trigger || '',
            motivation: habitData.motivation || '',
            icon: habitData.icon || '✅',
            timeType: habitData.timeType,
            duration: habitData.timeType === 'timer' ? habitData.duration : 30,
            isStrict: habitData.timeType === 'timer' ? habitData.isStrict : false,
            reminders: habitData.reminders || [],
          });
        }
      } catch (error) {
        console.error('Error loading habit:', error);
        toast.error('Failed to load habit');
      }
    };

    loadHabit();
  }, [habitId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !habitId) {
      toast.error('Invalid request');
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Please enter a habit name');
      return;
    }

    setIsLoading(true);

    try {
      const updates: any = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        category: formData.category,
        schedule: {
          time: formData.time,
          frequency: 'daily' as const,
        },
        trigger: formData.trigger,
        motivation: formData.motivation,
        icon: formData.icon,
        timeType: formData.timeType,
        reminders: formData.reminders,
      };

      if (formData.timeType === 'timer') {
        updates.duration = formData.duration;
        updates.isStrict = formData.isStrict;
      }

      await updateHabit(habitId, updates);

      toast.success('Habit updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating habit:', error);
      toast.error('Failed to update habit');
    } finally {
      setIsLoading(false);
    }
  };

  const addReminder = () => {
    if (formData.reminders.length < 10) {
      setFormData({
        ...formData,
        reminders: [...formData.reminders, '09:00'],
      });
    } else {
      toast.error('Maximum 10 reminders allowed');
    }
  };

  const removeReminder = (index: number) => {
    setFormData({
      ...formData,
      reminders: formData.reminders.filter((_, i) => i !== index),
    });
  };

  const updateReminder = (index: number, value: string) => {
    const newReminders = [...formData.reminders];
    newReminders[index] = value;
    setFormData({ ...formData, reminders: newReminders });
  };

  const emojiOptions = [
    '✅', '💪', '📚', '🧘', '🏃', '💤', '🥗', '💧', 
    '🚫', '🎯', '⚡', '🔥', '🌟', '🎨', '✍️', '🎵'
  ];

  if (!habit) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted py-8">
      <div className="container max-w-2xl mx-auto p-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Edit Habit</CardTitle>
            <CardDescription>
              Update your habit details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              
              <div className="space-y-3">
                <Label>Habit Type</Label>
                <RadioGroup
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as 'positive' | 'negative' })}
                >
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="positive" id="positive" />
                    <Label htmlFor="positive" className="flex-1 cursor-pointer">
                      <div className="font-semibold">Build a Habit</div>
                      <div className="text-sm text-muted-foreground">
                        Something you want to do regularly
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="negative" id="negative" />
                    <Label htmlFor="negative" className="flex-1 cursor-pointer">
                      <div className="font-semibold">Break a Habit</div>
                      <div className="text-sm text-muted-foreground">
                        Something you want to stop doing
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Habit Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Morning Exercise"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What does this habit involve?"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="health">🏥 Health & Fitness</SelectItem>
                    <SelectItem value="productivity">💼 Work & Productivity</SelectItem>
                    <SelectItem value="hobbies">🎨 Hobbies & Learning</SelectItem>
                    <SelectItem value="chores">🏠 Household & Chores</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Scheduled Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="trigger">Trigger (Optional)</Label>
                <Input
                  id="trigger"
                  value={formData.trigger}
                  onChange={(e) => setFormData({ ...formData, trigger: e.target.value })}
                  placeholder="e.g., After breakfast"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="motivation">Motivation Message</Label>
                <Textarea
                  id="motivation"
                  value={formData.motivation}
                  onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                  placeholder="Why is this habit important to you?"
                  rows={2}
                />
              </div>

              <div className="space-y-3">
                <Label>Time Type</Label>
                <RadioGroup
                  value={formData.timeType}
                  onValueChange={(value: HabitTimeType) => setFormData({ ...formData, timeType: value })}
                >
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="timer" id="timer" />
                    <Label htmlFor="timer" className="flex-1 cursor-pointer">
                      <div className="font-semibold">Timer-based</div>
                      <div className="text-sm text-muted-foreground">
                        Track duration of the activity
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="check-in" id="check-in" />
                    <Label htmlFor="check-in" className="flex-1 cursor-pointer">
                      <div className="font-semibold">Check-in</div>
                      <div className="text-sm text-muted-foreground">
                        Simple daily check-in
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.timeType === 'timer' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 30 })}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="strict"
                      checked={formData.isStrict}
                      onCheckedChange={(checked) => setFormData({ ...formData, isStrict: checked })}
                    />
                    <Label htmlFor="strict">Strict mode (must complete full duration)</Label>
                  </div>
                </>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Reminders (up to 10)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addReminder}
                    disabled={formData.reminders.length >= 10}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                {formData.reminders.map((reminder, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="time"
                      value={reminder}
                      onChange={(e) => updateReminder(index, e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeReminder(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label>Choose an Icon</Label>
                <div className="grid grid-cols-8 gap-2">
                  {emojiOptions.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: emoji })}
                      className={`p-3 text-2xl rounded-lg border-2 transition-colors ${
                        formData.icon === emoji
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Habit'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditHabit;
