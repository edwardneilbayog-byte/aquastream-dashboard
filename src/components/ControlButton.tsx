import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ControlButtonProps {
  title: string;
  icon: LucideIcon;
  colorClass: string;
  bgColorClass: string;
  onClick: () => void;
  onRelease?: () => void;
  isActive?: boolean;
  isTactSwitch?: boolean;
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
}: ControlButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    onClick();
    if (isTactSwitch) {
      setTimeout(() => setIsPressed(false), 200);
    }
  };

  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    if (!isTactSwitch) {
      setIsPressed(false);
    }
  };

  const handleRelease = () => {
    if (isTactSwitch && onRelease) {
      onRelease();
    }
  };

  return (
    <div className="glass-card p-6 transition-all duration-300 hover:shadow-elevated">
      <Button
        size="lg"
        className={cn(
          "w-full h-36 rounded-2xl transition-all duration-300 relative overflow-hidden group border-0",
          bgColorClass,
          isPressed || isActive 
            ? "scale-[0.98] brightness-95" 
            : "hover:scale-[1.02] hover:brightness-105 active:scale-[0.98]",
        )}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleRelease}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
      >
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        
        {/* Content */}
        <div className="flex flex-col items-center gap-3 relative z-10">
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300",
            isActive ? "bg-white/30 scale-110" : "bg-white/20"
          )}>
            <Icon className={cn("h-8 w-8", colorClass, isActive && "animate-pulse")} strokeWidth={2} />
          </div>
          <span className={cn("text-base font-semibold tracking-wide", colorClass)}>
            {title}
          </span>
          {isActive && (
            <span className={cn("text-xs font-medium px-3 py-1 rounded-full bg-white/20", colorClass)}>
              {isTactSwitch ? "ACTIVE" : "ON"}
            </span>
          )}
        </div>
      </Button>
    </div>
  );
};

export default ControlButton;
