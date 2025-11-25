import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDeviceSettings } from "@/hooks/useDeviceSettings";
import { useToast } from "@/components/ui/use-toast";
import { Wifi, WifiOff } from "lucide-react";

const DeviceSettings = () => {
  const { settings, updateSettings, resetSettings } = useDeviceSettings();
  const { toast } = useToast();
  const [esp32Url, setEsp32Url] = useState(settings.esp32Url);
  const [cameraUrl, setCameraUrl] = useState(settings.cameraUrl);
  const [testingEsp32, setTestingEsp32] = useState(false);
  const [testingCamera, setTestingCamera] = useState(false);

  const handleSave = () => {
    updateSettings({ esp32Url, cameraUrl });
    toast({
      title: "Settings saved",
      description: "Device URLs updated successfully",
    });
  };

  const handleReset = () => {
    resetSettings();
    setEsp32Url('http://192.168.1.150');
    setCameraUrl('http://192.168.1.151');
    toast({
      title: "Settings reset",
      description: "Device URLs reset to defaults",
    });
  };

  const testEsp32Connection = async () => {
    setTestingEsp32(true);
    try {
      const response = await fetch(`${esp32Url}/aquastream-dashboard/sensor_value.json`, {
        mode: 'cors',
      });
      if (response.ok) {
        toast({
          title: "Connection successful",
          description: "ESP32 controller is reachable",
        });
      } else {
        throw new Error('Failed to connect');
      }
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Unable to reach ESP32 controller",
        variant: "destructive",
      });
    } finally {
      setTestingEsp32(false);
    }
  };

  const testCameraConnection = async () => {
    setTestingCamera(true);
    try {
      const response = await fetch(`${cameraUrl}/stream`, {
        mode: 'no-cors',
      });
      toast({
        title: "Camera test initiated",
        description: "Check if camera stream loads below",
      });
    } catch (error) {
      toast({
        title: "Connection test sent",
        description: "If camera doesn't load, check the URL",
        variant: "destructive",
      });
    } finally {
      setTestingCamera(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Device Connection</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="esp32-url">ESP32 Controller URL</Label>
            <div className="flex gap-2">
              <Input
                id="esp32-url"
                value={esp32Url}
                onChange={(e) => setEsp32Url(e.target.value)}
                placeholder="http://192.168.1.150 or https://your-ngrok-url.ngrok.io"
              />
              <Button
                onClick={testEsp32Connection}
                disabled={testingEsp32}
                variant="outline"
                size="icon"
              >
                {testingEsp32 ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="camera-url">ESP32-CAM URL</Label>
            <div className="flex gap-2">
              <Input
                id="camera-url"
                value={cameraUrl}
                onChange={(e) => setCameraUrl(e.target.value)}
                placeholder="http://192.168.1.151 or https://your-ngrok-url.ngrok.io"
              />
              <Button
                onClick={testCameraConnection}
                disabled={testingCamera}
                variant="outline"
                size="icon"
              >
                {testingCamera ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-2 text-sm">
            <p className="font-medium">For remote access via ngrok:</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Install ngrok: <code className="text-xs bg-background px-1 rounded">npm install -g ngrok</code></li>
              <li>Run for ESP32: <code className="text-xs bg-background px-1 rounded">ngrok http 192.168.1.150</code></li>
              <li>Run for Camera: <code className="text-xs bg-background px-1 rounded">ngrok http 192.168.1.151</code></li>
              <li>Copy the https URLs and paste them above</li>
            </ol>
          </div>

          <div className="flex gap-2 justify-end">
            <Button onClick={handleReset} variant="outline">
              Reset to Defaults
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceSettings;
