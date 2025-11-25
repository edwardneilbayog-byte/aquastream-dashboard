import { User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  onSettingsClick: () => void;
}

const Navigation = ({ onSettingsClick }: NavigationProps) => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-aqua-gradient" />
            <h1 className="text-xl font-bold bg-aqua-gradient bg-clip-text text-transparent">
              AquaMonitor
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={onSettingsClick}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
