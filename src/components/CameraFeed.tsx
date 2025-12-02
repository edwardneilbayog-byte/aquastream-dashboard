import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Camera, Maximize2, X } from "lucide-react";

interface CameraFeedProps {
  streamUrl?: string;
}

const CameraFeed = ({ streamUrl = "http://192.168.1.151" }: CameraFeedProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const closeFullscreen = useCallback(() => {
    setIsFullscreen(false);
  }, []);

  const openFullscreen = () => {
    setIsFullscreen(true);
  };

  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        closeFullscreen();
      }
    };

    if (isFullscreen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isFullscreen, closeFullscreen]);

  // Fullscreen modal
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={closeFullscreen}>
        <button
          onClick={(e) => { e.stopPropagation(); closeFullscreen(); }}
          className="absolute top-20 right-6 p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors z-[101]"
          aria-label="Close fullscreen (ESC)"
        >
          <X className="h-6 w-6 text-white" />
        </button>
        <p className="absolute top-[88px] right-20 text-white/60 text-xs">ESC to exit</p>
        <div className="w-full h-full max-w-[90vw] max-h-[90vh] relative">
          <img 
            src={`${streamUrl}/stream`}
            alt="Aquarium Live Feed"
            className="w-full h-full object-contain"
          />
          {/* Live indicator in fullscreen */}
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-semibold text-white tracking-wide">LIVE</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden shadow-elevated glass-card w-full">
      <div className="relative aspect-video bg-muted overflow-hidden">
        <img 
          src={`${streamUrl}/stream`}
          alt="Aquarium Live Feed"
          className="h-full w-full object-cover cursor-pointer"
          onLoad={handleImageLoad}
          onError={handleImageError}
          onClick={openFullscreen}
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

        {/* Live indicator */}
        {!isLoading && !hasError && (
          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 bg-background/80 backdrop-blur-sm rounded-full border border-border/50">
            <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-semibold text-foreground tracking-wide">LIVE</span>
          </div>
        )}

        {/* Fullscreen button */}
        <button
          onClick={openFullscreen}
          className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-background transition-colors"
          aria-label="Open fullscreen"
        >
          <Maximize2 className="h-4 w-4 text-foreground" />
        </button>
      </div>
    </Card>
  );
};

export default CameraFeed;
