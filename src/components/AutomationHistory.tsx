import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAutomationHistory, HistoryEvent } from "@/hooks/useAutomationHistory";
import { useToast } from "@/hooks/use-toast";
import { 
  Droplet, 
  Fish, 
  Trash2, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Power, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  History
} from "lucide-react";

interface AutomationHistoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getEventIcon = (type: HistoryEvent['type']) => {
  switch (type) {
    case 'auto_water_change':
      return RefreshCw;
    case 'manual_pump_in_on':
    case 'manual_pump_in_off':
      return ArrowDownToLine;
    case 'manual_pump_out_on':
    case 'manual_pump_out_off':
      return ArrowUpFromLine;
    case 'manual_master_pump_on':
    case 'manual_master_pump_off':
      return Power;
    case 'manual_feeder_on':
    case 'manual_feeder_off':
      return Fish;
    case 'leak_detected':
      return AlertTriangle;
    case 'leak_cleared':
      return CheckCircle;
    default:
      return Droplet;
  }
};

const getEventLabel = (type: HistoryEvent['type']) => {
  switch (type) {
    case 'auto_water_change':
      return 'Auto Water Change';
    case 'manual_pump_in_on':
      return 'Pump In ON';
    case 'manual_pump_in_off':
      return 'Pump In OFF';
    case 'manual_pump_out_on':
      return 'Pump Out ON';
    case 'manual_pump_out_off':
      return 'Pump Out OFF';
    case 'manual_master_pump_on':
      return 'Master Pump ON';
    case 'manual_master_pump_off':
      return 'Master Pump OFF';
    case 'manual_feeder_on':
      return 'Feeder ON';
    case 'manual_feeder_off':
      return 'Feeder OFF';
    case 'leak_detected':
      return 'Leak Detected!';
    case 'leak_cleared':
      return 'Leak Cleared';
    default:
      return type;
  }
};

const getEventColor = (type: HistoryEvent['type']) => {
  if (type === 'leak_detected') return 'text-destructive';
  if (type === 'leak_cleared') return 'text-green-500';
  if (type === 'auto_water_change') return 'text-primary';
  if (type.includes('pump_in')) return 'text-blue-500';
  if (type.includes('pump_out')) return 'text-orange-500';
  if (type.includes('master')) return 'text-purple-500';
  if (type.includes('feeder')) return 'text-control-feeder';
  return 'text-muted-foreground';
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
  
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Action History
          </DialogTitle>
          <DialogDescription>
            Recent automation and manual control events
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <Droplet className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">No history events yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((event) => {
                const Icon = getEventIcon(event.type);
                const colorClass = getEventColor(event.type);
                return (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div className={`p-2 rounded-lg bg-background ${colorClass}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-sm">
                          {getEventLabel(event.type)}
                        </span>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatTimestamp(event.timestamp)}
                        </span>
                      </div>
                      {(event.ph || event.temp || event.tds || event.duration || event.trigger) && (
                        <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                          {event.trigger && (
                            <p>Triggered by: {event.trigger.toUpperCase()}</p>
                          )}
                          {event.temp && <p>Temp: {event.temp.toFixed(1)}°C</p>}
                          {event.ph && <p>pH: {event.ph.toFixed(2)}</p>}
                          {event.tds && <p>TDS: {event.tds} ppm</p>}
                          {event.duration && <p>Duration: {event.duration}s</p>}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {history.length > 0 && (
          <div className="flex justify-end pt-2 border-t">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearHistory}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear History
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
