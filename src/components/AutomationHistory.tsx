import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAutomationHistory, HistoryEvent } from '@/hooks/useAutomationHistory';
import { History, Droplet, Fish, Zap, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AutomationHistoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getEventIcon = (type: HistoryEvent['type']) => {
  switch (type) {
    case 'auto_pump':
      return <Zap className="h-4 w-4 text-control-pump" />;
    case 'manual_pump_on':
    case 'manual_pump_off':
      return <Droplet className="h-4 w-4 text-control-pump" />;
    case 'manual_feeder_on':
    case 'manual_feeder_off':
      return <Fish className="h-4 w-4 text-control-feeder" />;
  }
};

const getEventLabel = (type: HistoryEvent['type']) => {
  switch (type) {
    case 'auto_pump':
      return 'Auto Pump Activation';
    case 'manual_pump_on':
      return 'Pump Activated';
    case 'manual_pump_off':
      return 'Pump Deactivated';
    case 'manual_feeder_on':
      return 'Feeder Activated';
    case 'manual_feeder_off':
      return 'Feeder Deactivated';
  }
};

const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

export const AutomationHistory = ({ open, onOpenChange }: AutomationHistoryProps) => {
  const { history, clearHistory } = useAutomationHistory();
  const { toast } = useToast();

  const handleClearHistory = () => {
    clearHistory();
    toast({
      title: "History cleared",
      description: "All automation history has been deleted.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Automation History
          </DialogTitle>
          <DialogDescription>
            View past automation events and manual controls (last {history.length} events)
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[400px] pr-4">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <History className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No history events yet</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Events will appear here as automation runs
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="mt-0.5">{getEventIcon(event.type)}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-sm">{getEventLabel(event.type)}</p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTimestamp(event.timestamp)}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      {event.ph !== undefined && (
                        <p>pH Level: {event.ph.toFixed(2)}</p>
                      )}
                      {event.duration !== undefined && (
                        <p>Duration: {event.duration}s</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {history.length > 0 && (
          <div className="flex justify-end pt-4 border-t">
            <Button variant="destructive" size="sm" onClick={handleClearHistory}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear History
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
