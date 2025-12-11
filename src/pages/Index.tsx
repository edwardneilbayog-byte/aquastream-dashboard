import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import CameraFeed from "@/components/CameraFeed";
import SensorCard from "@/components/SensorCard";
import ControlButton from "@/components/ControlButton";
import SettingsDialog from "@/components/SettingsDialog";
import { AutomationHistory } from "@/components/AutomationHistory";
import { SensorHistory } from "@/components/SensorHistory";
import { LeakAlert } from "@/components/LeakAlert";
import { useESP32Control } from "@/hooks/useESP32Control";
import { useAutomationSettings } from "@/hooks/useAutomationSettings";
import { useDeviceSettings } from "@/hooks/useDeviceSettings";
import { Button } from "@/components/ui/button";
import { Thermometer, Droplets, Waves, Fish, Droplet, History, BarChart3, ArrowDownToLine, ArrowUpFromLine, Power } from "lucide-react";

const Index = () => {
  const { 
    sensorData, 
    activateFeeder, 
    deactivateFeeder, 
    activatePumpIn,
    deactivatePumpIn,
    activatePumpOut,
    deactivatePumpOut,
    activateMasterPump,
    deactivateMasterPump,
    fetchSensorData, 
    lastAutoActivation 
  } = useESP32Control();
  const { settings } = useAutomationSettings();
  const { settings: deviceSettings } = useDeviceSettings();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [sensorHistoryOpen, setSensorHistoryOpen] = useState(false);
  
  const cooldownMs = settings.cooldownPeriod * 60 * 1000;
  const timeSinceLastActivation = Date.now() - lastAutoActivation;
  const canAutoActivate = timeSinceLastActivation >= cooldownMs || lastAutoActivation === 0;
  const remainingMinutes = Math.ceil((cooldownMs - timeSinceLastActivation) / 60000);

  // Check if any sensor is out of safe range
  const tempOutOfRange = sensorData.temp > 0 && (sensorData.temp < settings.tempMin || sensorData.temp > settings.tempMax);
  const phOutOfRange = sensorData.ph > 0 && (sensorData.ph < settings.phMin || sensorData.ph > settings.phMax);
  const tdsOutOfRange = sensorData.tds > 0 && (sensorData.tds < settings.tdsMin || sensorData.tds > settings.tdsMax);
  const anyOutOfRange = tempOutOfRange || phOutOfRange || tdsOutOfRange;

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 10000);
    return () => clearInterval(interval);
  }, [fetchSensorData]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 bg-aqua-gradient opacity-[0.03] pointer-events-none" />
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Leak Alert Overlay */}
      <LeakAlert isLeakDetected={sensorData.leak} />
      
      <Navigation onSettingsClick={() => setSettingsOpen(true)} />
      
      <main className="container mx-auto px-4 py-8 space-y-8 relative z-10">
        {/* Camera Feed Section */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
            <h2 className="text-sm font-medium text-foreground">Live Feed</h2>
          </div>
          <CameraFeed streamUrl={deviceSettings.cameraUrl} />
        </section>

        {/* Sensor Data Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Waves className="h-5 w-5 text-primary" />
              </div>
              Water Parameters
            </h2>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSensorHistoryOpen(true)}
                className="rounded-full"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Sensor Log
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setHistoryOpen(true)}
                className="rounded-full"
              >
                <History className="h-4 w-4 mr-2" />
                Actions
              </Button>
            </div>
          </div>
          
          {/* Smart Water Change Notice */}
          {settings.enabled && anyOutOfRange && (
            <div className={`glass-card p-4 flex items-start gap-4 ${
              canAutoActivate 
                ? 'border-destructive/50' 
                : 'border-muted'
            }`}>
              <div className={`p-2 rounded-xl ${canAutoActivate ? 'bg-destructive/10' : 'bg-muted'}`}>
                <Droplet className={`h-5 w-5 ${
                  canAutoActivate ? 'text-destructive' : 'text-muted-foreground'
                }`} />
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold ${
                  canAutoActivate ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {canAutoActivate ? 'Water Change Will Trigger' : 'Water Change Cooldown'}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {canAutoActivate ? (
                    <>
                      {tempOutOfRange && (
                        <span className="block">• Temperature {sensorData.temp.toFixed(1)}°C outside safe range ({settings.tempMin}-{settings.tempMax}°C)</span>
                      )}
                      {phOutOfRange && (
                        <span className="block">• pH {sensorData.ph.toFixed(2)} outside safe range ({settings.phMin}-{settings.phMax})</span>
                      )}
                      {tdsOutOfRange && (
                        <span className="block">• TDS {sensorData.tds} ppm outside safe range ({settings.tdsMin}-{settings.tdsMax} ppm)</span>
                      )}
                      <span className="block mt-1 text-xs">Both pumps will run for {settings.waterChangeDuration} seconds.</span>
                    </>
                  ) : (
                    <>Automation is on cooldown. Next auto-activation available in {remainingMinutes} minute{remainingMinutes !== 1 ? 's' : ''}.</>
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
              colorClass={tempOutOfRange ? "text-destructive" : "text-sensor-temp"}
            />
            <SensorCard
              title="pH Level"
              value={sensorData.ph.toFixed(2)}
              unit="pH"
              icon={Droplets}
              colorClass={phOutOfRange ? "text-destructive" : "text-sensor-ph"}
            />
            <SensorCard
              title="TDS"
              value={sensorData.tds.toFixed(0)}
              unit="ppm"
              icon={Waves}
              colorClass={tdsOutOfRange ? "text-destructive" : "text-sensor-tds"}
            />
          </div>
        </section>

        {/* Control Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-3">
            <div className="p-2 rounded-xl bg-control-feeder/10">
              <Fish className="h-5 w-5 text-control-feeder" />
            </div>
            Aquarium Controls
          </h2>
          
          {/* Feeder */}
          <div className="grid grid-cols-1 gap-4">
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
          </div>
          
          {/* Pump Controls */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Droplet className="h-4 w-4" />
              Water Pump Controls
            </h3>
            
            {/* Individual Pumps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ControlButton
                title="Pump In (Fresh Water)"
                icon={ArrowDownToLine}
                colorClass="text-white"
                bgColorClass="bg-gradient-to-br from-blue-500 to-cyan-600 shadow-[0_4px_20px_-4px_rgba(59,130,246,0.5)]"
                onClick={sensorData.pumpIn ? deactivatePumpIn : activatePumpIn}
                isActive={sensorData.pumpIn}
              />
              <ControlButton
                title="Pump Out (Drain)"
                icon={ArrowUpFromLine}
                colorClass="text-white"
                bgColorClass="bg-gradient-to-br from-orange-500 to-amber-600 shadow-[0_4px_20px_-4px_rgba(249,115,22,0.5)]"
                onClick={sensorData.pumpOut ? deactivatePumpOut : activatePumpOut}
                isActive={sensorData.pumpOut}
              />
            </div>
            
            {/* Master Pump Control */}
            <ControlButton
              title="Master Control (Both Pumps)"
              icon={Power}
              colorClass="text-white"
              bgColorClass="bg-gradient-pump shadow-glow-pump"
              onClick={(sensorData.pumpIn && sensorData.pumpOut) ? deactivateMasterPump : activateMasterPump}
              isActive={sensorData.pumpIn && sensorData.pumpOut}
            />
          </div>
        </section>
      </main>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      <AutomationHistory open={historyOpen} onOpenChange={setHistoryOpen} />
      <SensorHistory open={sensorHistoryOpen} onOpenChange={setSensorHistoryOpen} />
    </div>
  );
};

export default Index;
