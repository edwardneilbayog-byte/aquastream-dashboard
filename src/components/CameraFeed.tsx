import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Camera } from "lucide-react";

interface CameraFeedProps {
  streamUrl?: string;
}

const CameraFeed = ({ streamUrl = "http://192.168.1.151" }: CameraFeedProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <Card className="overflow-hidden shadow-elevated">
      <div className="relative aspect-video bg-muted">
        <img 
          src={`${streamUrl}/stream`}
          alt="Aquarium Live Feed"
          className="h-full w-full object-cover"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        
        {/* Placeholder overlay - only show when loading or error */}
        {(isLoading || hasError) && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/95">
            <div className="text-center">
              <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {isLoading ? "Connecting..." : "Camera Offline"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{streamUrl}</p>
            </div>
          </div>
        )}

        {/* Live indicator - only show when stream is active */}
        {!isLoading && !hasError && (
          <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-background/80 backdrop-blur-sm rounded-full border border-border/50">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-semibold text-foreground tracking-wide">LIVE</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CameraFeed;
