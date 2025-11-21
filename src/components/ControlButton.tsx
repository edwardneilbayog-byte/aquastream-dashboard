import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ControlButtonProps {
  title: string;
  icon: LucideIcon;
  colorClass: string;
  bgColorClass: string;
  onClick: () => void;
  isActive?: boolean;
  isTactSwitch?: boolean;
}

const ControlButton = ({ 
  title, 
  icon: Icon, 
  colorClass, 
  bgColorClass,
  onClick,
  isActive = false,
  isTactSwitch = false
}: ControlButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    setIsPressed(true);
    onClick();
    if (isTactSwitch) {
      setTimeout(() => setIsPressed(false), 200);
    }
  };

  const handleRelease = () => {
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
              : "shadow-elevated hover:scale-[1.02] hover:shadow-xl active:scale-95"
          )}
          onMouseDown={handlePress}
          onMouseUp={handleRelease}
          onMouseLeave={handleRelease}
          onTouchStart={handlePress}
          onTouchEnd={handleRelease}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="flex flex-col items-center gap-3 relative z-10">
            <Icon className={cn("h-12 w-12", colorClass)} strokeWidth={2.5} />
            <span className={cn("text-base font-semibold tracking-wide", colorClass)}>
              {title}
            </span>
            {(isPressed || isActive) && (
              <span className={cn("text-xs font-medium", colorClass)}>
                {isTactSwitch ? "ACTIVATED" : "RUNNING"}
              </span>
            )}
          </div>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ControlButton;
