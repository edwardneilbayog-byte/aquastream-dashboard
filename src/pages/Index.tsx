import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import CameraFeed from "@/components/CameraFeed";
import SensorCard from "@/components/SensorCard";
import ControlButton from "@/components/ControlButton";
import SettingsDialog from "@/components/SettingsDialog";
import { AutomationHistory } from "@/components/AutomationHistory";
import { SensorHistory } from "@/components/SensorHistory";
import { LeakAlert } from "@/components/LeakAlert";
import { OverflowAlert } from "@/components/OverflowAlert";
import DemoSensorCharts from "@/components/DemoSensorCharts";
import { useESP32Control } from "@/hooks/useESP32Control";
import { useAutomationSettings } from "@/hooks/useAutomationSettings";
import { useDeviceSettings } from "@/hooks/useDeviceSettings";
import { Button } from "@/components/ui/button";
import { Thermometer, Droplets, Waves, Fish, Droplet, History, BarChart3, ArrowDownToLine, ArrowUpFromLine, Power, ShieldAlert, LineChart } from "lucide-react";
import { cn } from "@/lib/utils";

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
    lastAutoActivation,
    lastAutoFeeding
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

  // Calculate next feeding time
  const feederIntervalMs = settings.feederIntervalHours * 60 * 60 * 1000;
  const nextFeedingTime = lastAutoFeeding + feederIntervalMs;
  const timeUntilNextFeeding = nextFeedingTime - Date.now();
  const hoursUntilFeeding = Math.floor(timeUntilNextFeeding / (60 * 60 * 1000));
  const minutesUntilFeeding = Math.floor((timeUntilNextFeeding % (60 * 60 * 1000)) / 60000);

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
      
      {/* Overflow Alert Overlay */}
      <OverflowAlert isOverflowDetected={sensorData.overflow} />
      
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
        <section className="space-y-6">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Power className="h-5 w-5 text-primary" />
            </div>
            Device Controls
          </h2>
          
          {/* Control Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Feeding Card */}
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-control-feeder/15">
                    <Fish className="h-5 w-5 text-control-feeder" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Fish Feeder</h3>
                    <p className="text-xs text-muted-foreground">Press and hold to dispense food</p>
                  </div>
                </div>
                {settings.feederEnabled && (
                  <div className="text-right">
                    <p className="text-xs font-medium text-control-feeder">Auto-feeding</p>
                    <p className="text-xs text-muted-foreground">
                      {lastAutoFeeding === 0 
                        ? 'Pending first feed'
                        : timeUntilNextFeeding > 0 
                          ? `Next in ${hoursUntilFeeding}h ${minutesUntilFeeding}m`
                          : 'Due soon'}
                    </p>
                  </div>
                )}
              </div>
              <ControlButton
                title="Feed Now"
                icon={Fish}
                colorClass="text-white"
                bgColorClass="bg-gradient-feeder shadow-glow-feeder"
                onClick={activateFeeder}
                onRelease={deactivateFeeder}
                isActive={sensorData.feeder}
                isTactSwitch={true}
              />
            </div>
            
            {/* Water Exchange Card */}
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/15">
                  <Droplet className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Water Exchange</h3>
                  <p className="text-xs text-muted-foreground">Simultaneous inlet & outlet control</p>
                </div>
              </div>
              <ControlButton
                title="Start Exchange"
                icon={Waves}
                colorClass="text-white"
                bgColorClass="bg-gradient-pump shadow-glow-pump"
                onClick={(sensorData.pumpIn && sensorData.pumpOut) ? deactivateMasterPump : activateMasterPump}
                isActive={sensorData.pumpIn && sensorData.pumpOut}
              />
            </div>
          </div>
          
          {/* Individual Pump Controls */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-secondary">
                  <Waves className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Individual Pump Controls</h3>
                  <p className="text-xs text-muted-foreground">Manual control for each pump separately</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Pump In */}
              <button
                onClick={sensorData.overflow ? undefined : (sensorData.pumpIn ? deactivatePumpIn : activatePumpIn)}
                disabled={sensorData.overflow}
                className={cn(
                  "relative p-5 rounded-2xl transition-all duration-300 overflow-hidden group",
                  "flex items-center gap-4 border-2",
                  sensorData.overflow
                    ? "bg-muted border-amber-500/50 cursor-not-allowed opacity-75"
                    : sensorData.pumpIn 
                    ? "bg-gradient-to-br from-blue-500 to-cyan-600 border-blue-400 shadow-[0_4px_20px_-4px_rgba(59,130,246,0.5)]" 
                    : "bg-card border-border hover:border-blue-300 hover:shadow-md"
                )}
              >
                {/* Overflow indicator overlay */}
                {sensorData.overflow && (
                  <div className="absolute top-2 right-2">
                    <ShieldAlert className="h-4 w-4 text-amber-500" />
                  </div>
                )}
                <div className={cn(
                  "p-3 rounded-xl transition-colors",
                  sensorData.overflow 
                    ? "bg-amber-500/10"
                    : sensorData.pumpIn ? "bg-white/20" : "bg-blue-500/10"
                )}>
                  <ArrowDownToLine className={cn(
                    "h-6 w-6",
                    sensorData.overflow 
                      ? "text-amber-500"
                      : sensorData.pumpIn ? "text-white" : "text-blue-500"
                  )} />
                </div>
                <div className="flex-1 text-left">
                  <p className={cn(
                    "font-semibold",
                    sensorData.overflow
                      ? "text-amber-500"
                      : sensorData.pumpIn ? "text-white" : "text-foreground"
                  )}>Fresh Water Inlet</p>
                  <p className={cn(
                    "text-xs",
                    sensorData.overflow
                      ? "text-amber-500/70"
                      : sensorData.pumpIn ? "text-white/70" : "text-muted-foreground"
                  )}>
                    {sensorData.overflow 
                      ? "Blocked - Overflow protection" 
                      : sensorData.pumpIn ? "Running..." : "Tap to activate"}
                  </p>
                </div>
                {sensorData.pumpIn && !sensorData.overflow && (
                  <div className="h-3 w-3 rounded-full bg-white animate-pulse" />
                )}
              </button>
              
              {/* Pump Out */}
              <button
                onClick={sensorData.pumpOut ? deactivatePumpOut : activatePumpOut}
                className={cn(
                  "relative p-5 rounded-2xl transition-all duration-300 overflow-hidden group",
                  "flex items-center gap-4 border-2",
                  sensorData.pumpOut 
                    ? "bg-gradient-to-br from-orange-500 to-amber-600 border-orange-400 shadow-[0_4px_20px_-4px_rgba(249,115,22,0.5)]" 
                    : "bg-card border-border hover:border-orange-300 hover:shadow-md"
                )}
              >
                <div className={cn(
                  "p-3 rounded-xl transition-colors",
                  sensorData.pumpOut ? "bg-white/20" : "bg-orange-500/10"
                )}>
                  <ArrowUpFromLine className={cn(
                    "h-6 w-6",
                    sensorData.pumpOut ? "text-white" : "text-orange-500"
                  )} />
                </div>
                <div className="flex-1 text-left">
                  <p className={cn(
                    "font-semibold",
                    sensorData.pumpOut ? "text-white" : "text-foreground"
                  )}>Drain Outlet</p>
                  <p className={cn(
                    "text-xs",
                    sensorData.pumpOut ? "text-white/70" : "text-muted-foreground"
                  )}>
                    {sensorData.pumpOut ? "Running..." : "Tap to activate"}
                  </p>
                </div>
                {sensorData.pumpOut && (
                  <div className="h-3 w-3 rounded-full bg-white animate-pulse" />
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Demo Sensor Analytics Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <LineChart className="h-5 w-5 text-primary" />
            </div>
            Sensor Analytics (Demo)
          </h2>
          <DemoSensorCharts />
        </section>
      </main>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      <AutomationHistory open={historyOpen} onOpenChange={setHistoryOpen} />
      <SensorHistory open={sensorHistoryOpen} onOpenChange={setSensorHistoryOpen} />
    </div>
  );
};

export default Index;
