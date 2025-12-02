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
    <div className="glass-card p-5 hover:shadow-elevated transition-all duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className={cn("p-2.5 rounded-xl bg-muted", colorClass)}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold tracking-tight text-foreground">{value}</span>
        <span className="text-base text-muted-foreground font-medium">{unit}</span>
      </div>
    </div>
  );
};

export default SensorCard;
