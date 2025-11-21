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
    <Card className="shadow-soft">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button
          size="lg"
          className={cn(
            "h-24 w-24 rounded-xl transition-all",
            bgColorClass,
            isPressed || isActive ? "scale-95 shadow-inner" : "shadow-elevated hover:scale-105"
          )}
          onMouseDown={handlePress}
          onMouseUp={handleRelease}
          onMouseLeave={handleRelease}
          onTouchStart={handlePress}
          onTouchEnd={handleRelease}
        >
          <Icon className={cn("h-10 w-10", colorClass)} />
        </Button>
      </CardContent>
    </Card>
  );
};

export default ControlButton;
