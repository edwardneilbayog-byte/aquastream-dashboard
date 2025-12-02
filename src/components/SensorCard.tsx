import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SensorCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: LucideIcon;
  colorClass: string;
}

const SensorCard = ({ title, value, unit, icon: Icon, colorClass }: SensorCardProps) => {
  return (
    <div className="glass-card p-6 transition-all duration-300 hover:shadow-elevated hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", colorClass, "bg-current/10")}>
          <Icon className={cn("h-6 w-6", colorClass)} />
        </div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <div className="flex items-baseline gap-1">
          <span className={cn("text-3xl font-bold", colorClass)}>{value}</span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
      </div>
    </div>
  );
};

export default SensorCard;
