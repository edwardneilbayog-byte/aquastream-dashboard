import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSensorHistory } from '@/hooks/useSensorHistory';
import { BarChart3, Trash2, Thermometer, Droplets, Waves } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SensorHistoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const SensorHistory = ({ open, onOpenChange }: SensorHistoryProps) => {
  const { history, clearHistory } = useSensorHistory();
  const { toast } = useToast();

  const handleClearHistory = () => {
    clearHistory();
    toast({
      title: "History cleared",
      description: "All sensor history has been deleted.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Sensor Data History
          </DialogTitle>
          <DialogDescription>
            Last {history.length} sensor readings
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[400px]">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No sensor data yet</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Readings will appear here as data is collected
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Time</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Thermometer className="h-3 w-3 text-sensor-temp" />
                      Temp
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Droplets className="h-3 w-3 text-sensor-ph" />
                      pH
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Waves className="h-3 w-3 text-sensor-tds" />
                      TDS
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((reading) => (
                  <TableRow key={reading.id}>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatTimestamp(reading.timestamp)}
                    </TableCell>
                    <TableCell className="font-medium text-sensor-temp">
                      {reading.temp.toFixed(1)}°C
                    </TableCell>
                    <TableCell className="font-medium text-sensor-ph">
                      {reading.ph.toFixed(2)}
                    </TableCell>
                    <TableCell className="font-medium text-sensor-tds">
                      {reading.tds.toFixed(0)} ppm
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
