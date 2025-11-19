import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { createHabit } from '@/services/mockDataService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import ScheduleTypeSelector from '@/components/ScheduleTypeSelector';
import { Schedule } from '@/types';

const CreateHabit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'positive' as 'positive' | 'negative',
    category: 'productivity' as 'health' | 'chores' | 'hobbies' | 'productivity',
    time: '09:00',
    trigger: '',
    motivation: '',
    icon: '✅',
    timeType: 'check-in' as 'timer' | 'check-in',
    duration: 30,
    isStrict: false,
    reminders: [] as string[],
  });

  const [schedule, setSchedule] = useState<Schedule>({
    time: '09:00',
    frequency: 'daily',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in');
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Please enter a habit name');
      return;
    }

    // Validate schedule selection
    if (schedule.frequency === 'weekly' && (!schedule.daysOfWeek || schedule.daysOfWeek.length === 0)) {
      toast.error('Please select at least one day for weekly schedule');
      setIsLoading(false);
      return;
    }

    if (schedule.frequency === 'monthly' && (!schedule.daysOfMonth || schedule.daysOfMonth.length === 0)) {
      toast.error('Please select at least one day for monthly schedule');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const habitData: any = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        category: formData.category,
        schedule: {
          ...schedule,
          time: formData.time,
        },
        trigger: formData.trigger,
        motivation: formData.motivation,
        icon: formData.icon,
        timeType: formData.timeType,
        reminders: formData.reminders,
      };

      if (formData.timeType === 'timer') {
        habitData.duration = formData.duration;
        habitData.isStrict = formData.isStrict;
      }

      await createHabit(user.id, habitData);

      toast.success('Habit created successfully!', {
        description: 'Start building your streak today',
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating habit:', error);
      toast.error('Failed to create habit');
    } finally {
      setIsLoading(false);
    }
  };

  const emojiOptions = [
    '✅', '💪', '📚', '🧘', '🏃', '💤', '🥗', '💧', 
    '🚫', '🎯', '⚡', '🔥', '🌟', '🎨', '✍️', '🎵'
  ];

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
            <CardTitle className="text-2xl">Create New Habit</CardTitle>
            <CardDescription>
              Build a new habit or break a bad one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Habit Type */}
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

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="health">🏃 Health & Fitness</SelectItem>
                    <SelectItem value="productivity">⚡ Productivity</SelectItem>
                    <SelectItem value="hobbies">🎨 Hobbies & Learning</SelectItem>
                    <SelectItem value="chores">🏠 Chores & Household</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Icon Selection */}
              <div className="space-y-3">
                <Label>Choose an Icon</Label>
                <div className="grid grid-cols-8 gap-2">
                  {emojiOptions.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: emoji })}
                      className={`p-3 text-2xl border rounded-lg hover:bg-muted transition-colors ${
                        formData.icon === emoji ? 'border-primary bg-primary/10' : ''
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Habit Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Habit Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Morning Meditation, Avoid Social Media"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What does this habit involve?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Time */}
              <div className="space-y-2">
                <Label htmlFor="time">Reminder Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => {
                    setFormData({ ...formData, time: e.target.value });
                    setSchedule({ ...schedule, time: e.target.value });
                  }}
                />
              </div>

              {/* Schedule Type */}
              <ScheduleTypeSelector
                schedule={schedule}
                onScheduleChange={setSchedule}
              />

              {/* Trigger */}
              <div className="space-y-2">
                <Label htmlFor="trigger">Trigger (Optional)</Label>
                <Input
                  id="trigger"
                  placeholder="e.g., After waking up, Before bed"
                  value={formData.trigger}
                  onChange={(e) => setFormData({ ...formData, trigger: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  When or where will you do this habit?
                </p>
              </div>

              {/* Motivation */}
              <div className="space-y-2">
                <Label htmlFor="motivation">Motivation Message</Label>
                <Textarea
                  id="motivation"
                  placeholder="Why is this habit important to you?"
                  value={formData.motivation}
                  onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                  rows={2}
                />
              </div>

              {/* Time Type */}
              <div className="space-y-3">
                <Label>Time Type</Label>
                <RadioGroup
                  value={formData.timeType}
                  onValueChange={(value: 'timer' | 'check-in') => setFormData({ ...formData, timeType: value })}
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

              {/* Timer-specific fields */}
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
                    <input
                      type="checkbox"
                      id="strict"
                      checked={formData.isStrict}
                      onChange={(e) => setFormData({ ...formData, isStrict: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="strict" className="text-sm">Strict mode (must complete full duration)</Label>
                  </div>
                </>
              )}

              {/* Reminders */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Reminders (up to 10)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (formData.reminders.length < 10) {
                        setFormData({
                          ...formData,
                          reminders: [...formData.reminders, '09:00'],
                        });
                      } else {
                        toast.error('Maximum 10 reminders allowed');
                      }
                    }}
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
                      onChange={(e) => {
                        const newReminders = [...formData.reminders];
                        newReminders[index] = e.target.value;
                        setFormData({ ...formData, reminders: newReminders });
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          reminders: formData.reminders.filter((_, i) => i !== index),
                        });
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? 'Creating...' : 'Create Habit'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateHabit;
