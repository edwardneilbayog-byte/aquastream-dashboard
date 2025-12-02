import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import aquastreamLogo from "@/assets/aquastream-logo.png";

interface NavigationProps {
  onSettingsClick: () => void;
}

const Navigation = ({ onSettingsClick }: NavigationProps) => {
  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={aquastreamLogo} alt="AquaStream Logo" className="h-9 w-9 rounded-xl shadow-soft" />
            <h1 className="text-xl font-bold text-gradient">
              AquaStream
            </h1>
          </Link>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-muted"
            onClick={onSettingsClick}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
