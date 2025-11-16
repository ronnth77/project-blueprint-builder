import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CalendarDayProps {
  date: Date;
  status: 'completed' | 'missed' | 'future';
  isToday: boolean;
  notes?: string;
}

const CalendarDay = ({ date, status, isToday, notes }: CalendarDayProps) => {
  const dayNumber = format(date, 'd');

  const statusStyles = {
    completed: 'bg-success text-success-foreground hover:bg-success/80',
    missed: 'bg-destructive text-destructive-foreground hover:bg-destructive/80',
    future: 'bg-muted text-muted-foreground hover:bg-muted/80',
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'aspect-square flex items-center justify-center rounded-sm text-sm font-medium cursor-default transition-colors',
              statusStyles[status],
              isToday && 'ring-2 ring-primary ring-offset-2'
            )}
          >
            {dayNumber}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs space-y-1">
            <p className="font-semibold">{format(date, 'MMM d, yyyy')}</p>
            <p className="capitalize">{status}</p>
            {notes && (
              <p className="text-muted-foreground max-w-[200px]">{notes}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CalendarDay;
