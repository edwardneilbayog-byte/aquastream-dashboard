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
    // For tact switch, activation is handled by mouseDown, so skip onClick
    if (!isTactSwitch) {
      onClick();
    }
  };

  const handleMouseDown = () => {
    setIsPressed(true);
    // For tact switch, activate on press
    if (isTactSwitch) {
      onClick();
    }
  };

  const handleMouseUp = () => {
    // For tact switch, deactivate on release
    if (isTactSwitch && onRelease && isPressed) {
      onRelease();
    }
    setIsPressed(false);
  };

  const handleMouseLeave = () => {
    // For tact switch, deactivate if user drags away while pressing
    if (isTactSwitch && onRelease && isPressed) {
      onRelease();
    }
    setIsPressed(false);
  };

  return (
    <button
      className={cn(
        "relative w-full p-8 rounded-3xl transition-all duration-300 overflow-hidden group",
        "flex flex-col items-center justify-center gap-4",
        bgColorClass,
        isPressed || isActive 
          ? "scale-[0.97] shadow-lg" 
          : "shadow-elevated hover:scale-[1.02] hover:shadow-xl active:scale-[0.97]",
      )}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-transparent opacity-100" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className={cn(
          "p-4 rounded-2xl bg-white/20 backdrop-blur-sm transition-transform duration-300",
          isActive && "animate-pulse"
        )}>
          <Icon className={cn("h-10 w-10", colorClass)} strokeWidth={2} />
        </div>
        
        <span className={cn("text-lg font-semibold tracking-wide", colorClass)}>
          {title}
        </span>
        
        {isActive && (
          <span className={cn(
            "text-xs font-medium px-3 py-1 rounded-full bg-white/20",
            colorClass
          )}>
            {isTactSwitch ? "FEEDING" : "RUNNING"}
          </span>
        )}
      </div>
    </button>
  );
};

export default ControlButton;
