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
      <div className="relative aspect-[21/9] max-h-[240px] bg-muted">
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
              <Camera className="mx-auto h-8 w-8 text-muted-foreground mb-1" />
              <p className="text-xs text-muted-foreground">
                {isLoading ? "Connecting..." : "Camera Offline"}
              </p>
            </div>
          </div>
        )}

        {/* Live indicator - only show when stream is active */}
        {!isLoading && !hasError && (
          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 bg-background/80 backdrop-blur-sm rounded-full border border-border/50">
            <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-semibold text-foreground tracking-wide">LIVE</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CameraFeed;
