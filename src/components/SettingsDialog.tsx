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
import { RotateCcw, Fish } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import DeviceSettings from "./DeviceSettings";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const { settings, updateSettings, resetSettings, DEFAULT_SETTINGS } = useAutomationSettings();
  const { toast } = useToast();
  const [localSettings, setLocalSettings] = useState(settings);

  // Sync local settings when dialog opens
  useEffect(() => {
    if (open) {
      setLocalSettings(settings);
    }
  }, [open, settings]);

  const handleSaveAutomation = () => {
    updateSettings(localSettings);
    toast({
      title: "Settings saved",
      description: "Automation settings have been updated successfully.",
    });
  };

  const handleResetAutomation = () => {
    resetSettings();
    setLocalSettings(DEFAULT_SETTINGS);
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
            Configure device connections and smart water change automation
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="device" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="device">Device</TabsTrigger>
            <TabsTrigger value="automation">Water Change</TabsTrigger>
            <TabsTrigger value="feeder">Feeder</TabsTrigger>
          </TabsList>
          
          <TabsContent value="device" className="space-y-4">
            <DeviceSettings />
          </TabsContent>
          
          <TabsContent value="automation" className="space-y-4">
            <div className="space-y-6 py-4">
              {/* Enable/Disable Automation */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="automation-enabled">Enable Smart Water Change</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically run both pumps when water parameters are unsafe
                  </p>
                </div>
                <Switch
                  id="automation-enabled"
                  checked={localSettings.enabled}
                  onCheckedChange={(checked) => setLocalSettings(prev => ({ ...prev, enabled: checked }))}
                />
              </div>

              {/* Water Change Duration */}
              <div className="space-y-2">
                <Label htmlFor="water-change-duration">Water Change Duration (seconds)</Label>
                <Input
                  id="water-change-duration"
                  type="number"
                  min="30"
                  max="300"
                  value={localSettings.waterChangeDuration}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, waterChangeDuration: parseInt(e.target.value) || 60 }))}
                />
                <p className="text-sm text-muted-foreground">
                  How long both pumps run during automatic water change (30-300 seconds)
                </p>
              </div>

              {/* Temperature Range */}
              <div className="space-y-3">
                <Label>Safe Temperature Range (°C)</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="temp-min" className="text-sm text-muted-foreground">
                      Minimum
                    </Label>
                    <Input
                      id="temp-min"
                      type="number"
                      step="0.5"
                      min="15"
                      max="35"
                      value={localSettings.tempMin}
                      onChange={(e) => setLocalSettings(prev => ({ ...prev, tempMin: parseFloat(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="temp-max" className="text-sm text-muted-foreground">
                      Maximum
                    </Label>
                    <Input
                      id="temp-max"
                      type="number"
                      step="0.5"
                      min="15"
                      max="35"
                      value={localSettings.tempMax}
                      onChange={(e) => setLocalSettings(prev => ({ ...prev, tempMax: parseFloat(e.target.value) }))}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Recommended: 24-28°C for most tropical fish
                </p>
              </div>

              {/* pH Range */}
              <div className="space-y-3">
                <Label>Safe pH Range</Label>
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
                <p className="text-xs text-muted-foreground">
                  Recommended: 6.5-7.5 for most freshwater fish
                </p>
              </div>

              {/* TDS Range */}
              <div className="space-y-3">
                <Label>Safe TDS Range (ppm)</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="tds-min" className="text-sm text-muted-foreground">
                      Minimum
                    </Label>
                    <Input
                      id="tds-min"
                      type="number"
                      min="0"
                      max="1000"
                      value={localSettings.tdsMin}
                      onChange={(e) => setLocalSettings(prev => ({ ...prev, tdsMin: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tds-max" className="text-sm text-muted-foreground">
                      Maximum
                    </Label>
                    <Input
                      id="tds-max"
                      type="number"
                      min="0"
                      max="1000"
                      value={localSettings.tdsMax}
                      onChange={(e) => setLocalSettings(prev => ({ ...prev, tdsMax: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Recommended: 150-400 ppm for most freshwater aquariums
                </p>
              </div>

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
                  Minimum time between automatic water changes
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

          <TabsContent value="feeder" className="space-y-4">
            <div className="space-y-6 py-4">
              {/* Enable/Disable Feeder Automation */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="feeder-enabled" className="flex items-center gap-2">
                    <Fish className="h-4 w-4 text-control-feeder" />
                    Enable Auto-Feeding
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically feed fish at scheduled intervals
                  </p>
                </div>
                <Switch
                  id="feeder-enabled"
                  checked={localSettings.feederEnabled}
                  onCheckedChange={(checked) => setLocalSettings(prev => ({ ...prev, feederEnabled: checked }))}
                />
              </div>

              {/* Feeding Interval */}
              <div className="space-y-2">
                <Label htmlFor="feeder-interval">Feeding Interval (hours)</Label>
                <Input
                  id="feeder-interval"
                  type="number"
                  min="1"
                  max="72"
                  value={localSettings.feederIntervalHours}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, feederIntervalHours: parseInt(e.target.value) || 24 }))}
                />
                <p className="text-sm text-muted-foreground">
                  Fish will be fed every {localSettings.feederIntervalHours} hour{localSettings.feederIntervalHours !== 1 ? 's' : ''} (1-72 hours)
                </p>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> The feeder hardware controls the actual feeding duration. 
                  This automation sends a signal at the scheduled time to trigger the feeding mechanism.
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
