import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import CameraFeed from "@/components/CameraFeed";
import SensorCard from "@/components/SensorCard";
import ControlButton from "@/components/ControlButton";
import SettingsDialog from "@/components/SettingsDialog";
import { AutomationHistory } from "@/components/AutomationHistory";
import { useESP32Control } from "@/hooks/useESP32Control";
import { useAutomationSettings } from "@/hooks/useAutomationSettings";
import { useDeviceSettings } from "@/hooks/useDeviceSettings";
import { Button } from "@/components/ui/button";
import { Thermometer, Droplets, Waves, Fish, Droplet, History } from "lucide-react";

const Index = () => {
  const { sensorData, activateFeeder, deactivateFeeder, activatePump, deactivatePump, fetchSensorData, lastAutoActivation } = useESP32Control();
  const { settings } = useAutomationSettings();
  const { settings: deviceSettings } = useDeviceSettings();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  
  const cooldownMs = settings.cooldownPeriod * 60 * 1000;
  const timeSinceLastActivation = Date.now() - lastAutoActivation;
  const canAutoActivate = timeSinceLastActivation >= cooldownMs || lastAutoActivation === 0;
  const remainingMinutes = Math.ceil((cooldownMs - timeSinceLastActivation) / 60000);

  useEffect(() => {
    // Fetch sensor data on mount
    fetchSensorData();
    
    // Poll sensor data every 10 seconds
    const interval = setInterval(fetchSensorData, 10000);
    
    return () => clearInterval(interval);
  }, [fetchSensorData]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 bg-aqua-gradient opacity-5 pointer-events-none" />
      <div className="fixed inset-0 bg-water-shimmer opacity-10 pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      
      <Navigation onSettingsClick={() => setSettingsOpen(true)} />
      
      <main className="container mx-auto px-4 py-6 space-y-8 relative z-10">
        {/* Camera Feed Section */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-red-500 animate-pulse" />
            <h2 className="text-lg font-semibold text-foreground">Live Camera Feed</h2>
          </div>
          <CameraFeed streamUrl={deviceSettings.cameraUrl} />
        </section>

        {/* Sensor Data Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Waves className="h-5 w-5 text-primary" />
              Water Parameters
            </h2>
            <Button variant="outline" size="sm" onClick={() => setHistoryOpen(true)}>
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
          </div>
          
          {/* pH Automation Notice */}
          {settings.enabled && sensorData.ph >= settings.phMin && sensorData.ph <= settings.phMax && (
            <div className={`border-2 rounded-lg p-4 flex items-start gap-3 ${
              canAutoActivate 
                ? 'bg-gradient-pump/10 border-control-pump animate-pulse' 
                : 'bg-muted/50 border-muted-foreground/30'
            }`}>
              <Droplet className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                canAutoActivate ? 'text-control-pump' : 'text-muted-foreground'
              }`} />
              <div className="flex-1">
                <h3 className={`font-semibold ${
                  canAutoActivate ? 'text-control-pump' : 'text-muted-foreground'
                }`}>
                  {canAutoActivate ? 'pH Automation Ready' : 'pH Automation Cooldown'}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {canAutoActivate ? (
                    <>pH level is {sensorData.ph.toFixed(2)} (target: {settings.phMin}-{settings.phMax}). Water pump will auto-activate for {settings.pumpDuration} seconds to adjust water quality.</>
                  ) : (
                    <>pH level is {sensorData.ph.toFixed(2)} but automation is on cooldown. Next auto-activation available in {remainingMinutes} minute{remainingMinutes !== 1 ? 's' : ''}. Manual control still available.</>
                  )}
                </p>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SensorCard
              title="Temperature"
              value={sensorData.temp.toFixed(1)}
              unit="°C"
              icon={Thermometer}
              colorClass="text-sensor-temp"
            />
            <SensorCard
              title="pH Level"
              value={sensorData.ph.toFixed(2)}
              unit="pH"
              icon={Droplets}
              colorClass="text-sensor-ph"
            />
            <SensorCard
              title="TDS"
              value={sensorData.tds.toFixed(0)}
              unit="ppm"
              icon={Waves}
              colorClass="text-sensor-tds"
            />
          </div>
        </section>

        {/* Control Section */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Fish className="h-5 w-5 text-control-feeder" />
            Aquarium Controls
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <ControlButton
              title="Fish Feeder"
              icon={Fish}
              colorClass="text-white"
              bgColorClass="bg-gradient-feeder shadow-glow-feeder"
              onClick={activateFeeder}
              onRelease={deactivateFeeder}
              isActive={sensorData.feeder}
              isTactSwitch={true}
            />
            <ControlButton
              title="Water Pump"
              icon={Droplet}
              colorClass="text-white"
              bgColorClass="bg-gradient-pump shadow-glow-pump"
              onClick={sensorData.pump ? deactivatePump : activatePump}
              isActive={sensorData.pump}
            />
          </div>
        </section>
      </main>

      {/* Settings & History Modals */}
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      <AutomationHistory open={historyOpen} onOpenChange={setHistoryOpen} />
    </div>
  );
};

export default Index;
