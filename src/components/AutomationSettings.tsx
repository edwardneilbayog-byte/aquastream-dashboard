import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useAutomationSettings } from '@/hooks/useAutomationSettings';
import { Settings, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AutomationSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AutomationSettings = ({ open, onOpenChange }: AutomationSettingsProps) => {
  const { settings, updateSettings, resetSettings } = useAutomationSettings();
  const { toast } = useToast();
  
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    updateSettings(localSettings);
    toast({
      title: "Settings saved",
      description: "Automation settings have been updated successfully.",
    });
    onOpenChange(false);
  };

  const handleReset = () => {
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Automation Settings
          </DialogTitle>
          <DialogDescription>
            Configure pH automation parameters for your aquarium system.
          </DialogDescription>
        </DialogHeader>
        
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

          {/* Pump Duration */}
          <div className="space-y-2">
            <Label htmlFor="pump-duration">Pump Duration (seconds)</Label>
            <Input
              id="pump-duration"
              type="number"
              min="5"
              max="120"
              value={localSettings.pumpDuration}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, pumpDuration: parseInt(e.target.value) }))}
            />
            <p className="text-sm text-muted-foreground">
              How long the pump runs when activated
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
              Time between automatic activations
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
