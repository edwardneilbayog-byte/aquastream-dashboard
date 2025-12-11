import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface LeakAlertProps {
  isLeakDetected: boolean;
  onDismiss?: () => void;
}

export const LeakAlert = ({ isLeakDetected, onDismiss }: LeakAlertProps) => {
  const [isDismissed, setIsDismissed] = useState(false);

  // Reset dismissed state when leak is cleared
  useEffect(() => {
    if (!isLeakDetected) {
      setIsDismissed(false);
    }
  }, [isLeakDetected]);

  if (!isLeakDetected || isDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative mx-4 max-w-md w-full">
        {/* Animated glow effect */}
        <div className="absolute inset-0 bg-destructive/30 rounded-2xl blur-xl animate-pulse" />
        
        <div className="relative glass-card border-2 border-destructive/50 p-6 space-y-4">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full hover:bg-destructive/20"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Icon with pulse animation */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-destructive/50 rounded-full blur-lg animate-ping" />
              <div className="relative p-4 bg-destructive/20 rounded-full">
                <AlertTriangle className="h-12 w-12 text-destructive animate-pulse" />
              </div>
            </div>
          </div>

          {/* Alert content */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-destructive">
              LEAK DETECTED!
            </h2>
            <p className="text-foreground font-medium">
              Water level sensor has been triggered
            </p>
            <p className="text-sm text-muted-foreground">
              Please check your aquarium immediately. The float switch has detected a potential water leak or abnormal water level drop.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-2">
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDismiss}
            >
              I'll Check It
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              This alert will reappear if the leak persists
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
