import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAutomationSettings } from "@/hooks/useAutomationSettings";
import { RotateCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import DeviceSettings from "./DeviceSettings";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const { settings, updateSettings, resetSettings } = useAutomationSettings();
  const { toast } = useToast();
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSaveAutomation = () => {
    updateSettings(localSettings);
    toast({
      title: "Settings saved",
      description: "Automation settings have been updated successfully.",
    });
  };

  const handleResetAutomation = () => {
    resetSettings();
    setLocalSettings({
      enabled: true,
      phMin: 5.0,
      phMax: 6.0,
      pumpDuration: 30,
      cooldownPeriod: 60,
    });
    toast({
      title: "Settings reset",
      description: "Automation settings have been reset to defaults.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure device connections and automation parameters
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="device" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="device">Device Connection</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="device" className="space-y-4">
            <DeviceSettings />
          </TabsContent>
          
          <TabsContent value="automation" className="space-y-4">
            <div className="space-y-6 py-4">
              {/* Enable/Disable Automation */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="automation-enabled">Enable pH Automation</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically activate pump when pH is in range
                  </p>
                </div>
                <Switch
                  id="automation-enabled"
                  checked={localSettings.enabled}
                  onCheckedChange={(checked) => setLocalSettings(prev => ({ ...prev, enabled: checked }))}
                />
              </div>

              {/* pH Range */}
              <div className="space-y-3">
                <Label>pH Threshold Range</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="ph-min" className="text-sm text-muted-foreground">
                      Minimum pH
                    </Label>
                    <Input
                      id="ph-min"
                      type="number"
                      step="0.1"
                      min="0"
                      max="14"
                      value={localSettings.phMin}
                      onChange={(e) => setLocalSettings(prev => ({ ...prev, phMin: parseFloat(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ph-max" className="text-sm text-muted-foreground">
                      Maximum pH
                    </Label>
                    <Input
                      id="ph-max"
                      type="number"
                      step="0.1"
                      min="0"
                      max="14"
                      value={localSettings.phMax}
                      onChange={(e) => setLocalSettings(prev => ({ ...prev, phMax: parseFloat(e.target.value) }))}
                    />
                  </div>
                </div>
              </div>

              {/* Pump Duration - Fixed */}
              {/* <div className="space-y-2">
                <Label>Pump Duration</Label>
                <div className="flex items-center h-10 px-3 py-2 border border-input bg-muted rounded-md">
                  <span className="text-sm">30 seconds (calculated duration)</span>
                </div>
              </div> */}

              {/* Cooldown Period */}
              <div className="space-y-2">
                <Label htmlFor="cooldown-period">Cooldown Period (minutes)</Label>
                <Input
                  id="cooldown-period"
                  type="number"
                  min="5"
                  max="1440"
                  value={localSettings.cooldownPeriod}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, cooldownPeriod: parseInt(e.target.value) }))}
                />
                <p className="text-sm text-muted-foreground">
                  Time between automatic activations
                </p>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleResetAutomation}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset to Defaults
                </Button>
                <Button onClick={handleSaveAutomation}>
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
