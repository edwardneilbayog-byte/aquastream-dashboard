import { Card } from "@/components/ui/card";
import { Camera } from "lucide-react";

interface CameraFeedProps {
  streamUrl?: string;
}

const CameraFeed = ({ streamUrl = "http://192.168.1.151" }: CameraFeedProps) => {
  return (
    <Card className="overflow-hidden shadow-elevated">
      <div className="relative aspect-video bg-muted">
        <img 
          src={`${streamUrl}/stream`}
          alt="Aquarium Live Feed"
          className="h-full w-full object-cover"
          onError={(e) => {
            // Fallback for when camera is not available
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-muted/90">
          <div className="text-center">
            <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Camera Feed</p>
            <p className="text-xs text-muted-foreground mt-1">Connecting to {streamUrl}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CameraFeed;
