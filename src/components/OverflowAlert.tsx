import { ShieldAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface OverflowAlertProps {
  isOverflowDetected: boolean;
  onDismiss?: () => void;
}

export const OverflowAlert = ({ isOverflowDetected, onDismiss }: OverflowAlertProps) => {
  const [isDismissed, setIsDismissed] = useState(false);

  // Reset dismissed state when overflow is cleared
  useEffect(() => {
    if (!isOverflowDetected) {
      setIsDismissed(false);
    }
  }, [isOverflowDetected]);

  if (!isOverflowDetected || isDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative mx-4 max-w-md w-full">
        {/* Animated glow effect - amber/orange for overflow */}
        <div className="absolute inset-0 bg-amber-500/30 rounded-2xl blur-xl animate-pulse" />
        
        <div className="relative glass-card border-2 border-amber-500/50 p-6 space-y-4">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full hover:bg-amber-500/20"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Icon with pulse animation */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500/50 rounded-full blur-lg animate-ping" />
              <div className="relative p-4 bg-amber-500/20 rounded-full">
                <ShieldAlert className="h-12 w-12 text-amber-500 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Alert content */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-amber-500">
              OVERFLOW PROTECTION ACTIVE
            </h2>
            <p className="text-foreground font-medium">
              Water level too high - Inlet pump stopped!
            </p>
            <p className="text-sm text-muted-foreground">
              The fail-safe float switch has detected that water level is approaching maximum capacity. 
              The fresh water inlet pump has been automatically disabled to prevent overflow.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-2">
            <Button
              className="w-full bg-amber-500 hover:bg-amber-600 text-white"
              onClick={handleDismiss}
            >
              I Understand
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Inlet pump will remain blocked until water level drops
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
