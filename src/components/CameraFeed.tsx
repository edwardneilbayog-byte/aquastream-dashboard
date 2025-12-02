import { useState } from "react";
import { Video, VideoOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraFeedProps {
  streamUrl?: string;
}

const CameraFeed = ({ streamUrl = "http://192.168.1.151" }: CameraFeedProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [key, setKey] = useState(0);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setHasError(false);
    setKey(prev => prev + 1);
  };

  return (
    <div className="glass-card overflow-hidden">
      <div className="aspect-video relative bg-muted/30">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Video className="h-10 w-10 text-muted-foreground animate-pulse" />
              <span className="text-sm text-muted-foreground">Connecting to camera...</span>
            </div>
          </div>
        )}
        
        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <VideoOff className="h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Unable to load camera feed</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="glass border-border/50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        ) : (
          <img
            key={key}
            src={`${streamUrl}/stream`}
            alt="Aquarium Camera Feed"
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}

        {/* Live indicator */}
        {!hasError && !isLoading && (
          <div className="absolute top-4 left-4 flex items-center gap-2 glass px-3 py-1.5 rounded-full">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-medium">LIVE</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraFeed;
