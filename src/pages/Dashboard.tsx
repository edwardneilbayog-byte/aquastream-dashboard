import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import CameraFeed from "@/components/CameraFeed";
import SensorCard from "@/components/SensorCard";
import ControlButton from "@/components/ControlButton";
import SettingsDialog from "@/components/SettingsDialog";
import { AutomationHistory } from "@/components/AutomationHistory";
import { useESP32Control } from "@/hooks/useESP32Control";
import { useAutomationSettings } from "@/hooks/useAutomationSettings";
import { useDeviceSettings } from "@/hooks/useDeviceSettings";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Thermometer, Droplets, Waves, Fish, Droplet, History, Loader2 } from "lucide-react";

const Dashboard = () => {
  const { sensorData, activateFeeder, deactivateFeeder, activatePump, deactivatePump, fetchSensorData, lastAutoActivation } = useESP32Control();
  const { settings } = useAutomationSettings();
  const { settings: deviceSettings } = useDeviceSettings();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  
  const cooldownMs = settings.cooldownPeriod * 60 * 1000;
  const timeSinceLastActivation = Date.now() - lastAutoActivation;
  const canAutoActivate = timeSinceLastActivation >= cooldownMs || lastAutoActivation === 0;
  const remainingMinutes = Math.ceil((cooldownMs - timeSinceLastActivation) / 60000);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchSensorData();
      const interval = setInterval(fetchSensorData, 10000);
      return () => clearInterval(interval);
    }
  }, [fetchSensorData, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>
      
      <Navigation onSettingsClick={() => setSettingsOpen(true)} />
      
      <main className="container mx-auto px-4 py-8 space-y-8 relative z-10">
        {/* Camera Feed Section */}
        <section className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <h2 className="text-xl font-semibold">Live Camera Feed</h2>
          </div>
          <CameraFeed streamUrl={deviceSettings.cameraUrl} />
        </section>

        {/* Sensor Data Section */}
        <section className="space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Waves className="h-5 w-5 text-primary-foreground" />
              </div>
              Water Parameters
            </h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setHistoryOpen(true)}
              className="glass border-border/50 hover:bg-card"
            >
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
          </div>
          
          {/* pH Automation Notice */}
          {settings.enabled && sensorData.ph >= settings.phMin && sensorData.ph <= settings.phMax && (
            <div className={`glass-card p-4 flex items-start gap-4 ${
              canAutoActivate 
                ? 'border-2 border-primary/50' 
                : 'border border-border/50'
            }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                canAutoActivate ? 'bg-gradient-primary' : 'bg-muted'
              }`}>
                <Droplet className={`h-5 w-5 ${
                  canAutoActivate ? 'text-primary-foreground' : 'text-muted-foreground'
                }`} />
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold ${
                  canAutoActivate ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {canAutoActivate ? 'pH Automation Ready' : 'pH Automation Cooldown'}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {canAutoActivate ? (
                    <>pH level is {sensorData.ph.toFixed(2)} (target: {settings.phMin}-{settings.phMax}). Water pump will auto-activate to adjust water quality.</>
                  ) : (
                    <>pH level is {sensorData.ph.toFixed(2)} but automation is on cooldown. Next auto-activation in {remainingMinutes} minute{remainingMinutes !== 1 ? 's' : ''}.</>
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
        <section className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl font-semibold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-feeder flex items-center justify-center">
              <Fish className="h-5 w-5 text-primary-foreground" />
            </div>
            Aquarium Controls
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ControlButton
              title="Fish Feeder"
              icon={Fish}
              colorClass="text-primary-foreground"
              bgColorClass="bg-gradient-feeder shadow-glow-feeder"
              onClick={activateFeeder}
              onRelease={deactivateFeeder}
              isActive={sensorData.feeder}
              isTactSwitch={true}
            />
            <ControlButton
              title={sensorData.pump ? "Pump ON" : "Water Pump"}
              icon={Droplet}
              colorClass="text-primary-foreground"
              bgColorClass="bg-gradient-pump shadow-glow-pump"
              onClick={sensorData.pump ? deactivatePump : activatePump}
              isActive={sensorData.pump}
            />
          </div>
        </section>
      </main>

      {/* Modals */}
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      <AutomationHistory open={historyOpen} onOpenChange={setHistoryOpen} />
    </div>
  );
};

export default Dashboard;
