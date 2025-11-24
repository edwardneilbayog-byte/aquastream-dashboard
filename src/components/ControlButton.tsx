import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface ControlButtonProps {
  title: string;
  icon: LucideIcon;
  colorClass: string;
  bgColorClass: string;
  onClick: () => void;
  onRelease?: () => void;
  isActive?: boolean;
  isTactSwitch?: boolean;
  showCountdown?: boolean;
  countdownDuration?: number;
}

const ControlButton = ({ 
  title, 
  icon: Icon, 
  colorClass, 
  bgColorClass,
  onClick,
  onRelease,
  isActive = false,
  isTactSwitch = false,
  showCountdown = false,
  countdownDuration = 30
}: ControlButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [countdown, setCountdown] = useState(countdownDuration);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isActive && showCountdown) {
      setCountdown(countdownDuration);
      setProgress(0);
      
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 0.1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 0.1;
        });
        
        setProgress(prev => {
          const newProgress = prev + (100 / (countdownDuration * 10));
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [isActive, showCountdown, countdownDuration]);

  const handlePress = () => {
    setIsPressed(true);
    onClick();
    if (isTactSwitch) {
      setTimeout(() => setIsPressed(false), 200);
    }
  };

  const handleRelease = () => {
    if (isTactSwitch && onRelease) {
      onRelease();
    }
    if (!isTactSwitch) {
      setIsPressed(false);
    }
  };

  return (
    <Card className="shadow-soft overflow-hidden border-2">
      <CardContent className="p-6">
        <Button
          size="lg"
          className={cn(
            "w-full h-32 rounded-2xl transition-all duration-300 relative overflow-hidden group",
            bgColorClass,
            isPressed || isActive 
              ? "scale-95 shadow-inner brightness-90" 
              : "shadow-elevated hover:scale-[1.02] hover:shadow-xl active:scale-95",
            isActive && "animate-pulse"
          )}
          onMouseDown={handlePress}
          onMouseUp={handleRelease}
          onMouseLeave={handleRelease}
          onTouchStart={handlePress}
          onTouchEnd={handleRelease}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="flex flex-col items-center gap-2 relative z-10">
            <Icon className={cn("h-12 w-12", colorClass, isActive && "animate-bounce")} strokeWidth={2.5} />
            <span className={cn("text-base font-semibold tracking-wide", colorClass)}>
              {title}
            </span>
            {(isPressed || isActive) && (
              <>
                <span className={cn("text-xs font-medium", colorClass)}>
                  {isTactSwitch ? "ACTIVATED" : "EXECUTING"}
                </span>
                {showCountdown && isActive && (
                  <div className="w-full space-y-1.5 px-4">
                    <div className="flex justify-between items-center">
                      <span className={cn("text-[10px] font-bold", colorClass)}>
                        {countdown.toFixed(1)}s remaining
                      </span>
                      <span className={cn("text-[10px] font-medium", colorClass)}>
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <Progress value={progress} className="h-2 bg-white/30" />
                  </div>
                )}
              </>
            )}
          </div>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ControlButton;
