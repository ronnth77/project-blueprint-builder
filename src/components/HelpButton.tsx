import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import HelpDialogs from './HelpDialogs';

const HelpButton = () => {
  const [generalHelpOpen, setGeneralHelpOpen] = useState(false);
  const [notificationsHelpOpen, setNotificationsHelpOpen] = useState(false);
  const [analyticsHelpOpen, setAnalyticsHelpOpen] = useState(false);
  const [rewardsHelpOpen, setRewardsHelpOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" title="Help">
            <HelpCircle className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setGeneralHelpOpen(true)}>
            General
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setNotificationsHelpOpen(true)}>
            Notifications & Check-in
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setAnalyticsHelpOpen(true)}>
            Analytics
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setRewardsHelpOpen(true)}>
            Rewards & Badges
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <HelpDialogs
        generalHelpOpen={generalHelpOpen}
        setGeneralHelpOpen={setGeneralHelpOpen}
        notificationsHelpOpen={notificationsHelpOpen}
        setNotificationsHelpOpen={setNotificationsHelpOpen}
        analyticsHelpOpen={analyticsHelpOpen}
        setAnalyticsHelpOpen={setAnalyticsHelpOpen}
        rewardsHelpOpen={rewardsHelpOpen}
        setRewardsHelpOpen={setRewardsHelpOpen}
      />
    </>
  );
};

export default HelpButton;

