import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import CameraFeed from "@/components/CameraFeed";
import SensorCard from "@/components/SensorCard";
import ControlButton from "@/components/ControlButton";
import { useESP32Control } from "@/hooks/useESP32Control";
import { Thermometer, Droplets, Waves, Fish, Droplet } from "lucide-react";

const Index = () => {
  const { sensorData, activateFeeder, activatePump, fetchSensorData } = useESP32Control();

  useEffect(() => {
    // Fetch sensor data on mount
    fetchSensorData();
    
    // Poll sensor data every 5 seconds
    const interval = setInterval(fetchSensorData, 5000);
    
    return () => clearInterval(interval);
  }, [fetchSensorData]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Camera Feed */}
        <CameraFeed />

        {/* Sensor Data Cards */}
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
            value={sensorData.ph.toFixed(1)}
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

        {/* Control Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <ControlButton
            title="Fish Feeder"
            icon={Fish}
            colorClass="text-white"
            bgColorClass="bg-control-feeder hover:bg-control-feeder/90"
            onClick={activateFeeder}
            isActive={sensorData.feeder}
            isTactSwitch={true}
          />
          <ControlButton
            title="Water Pump"
            icon={Droplet}
            colorClass="text-white"
            bgColorClass="bg-control-pump hover:bg-control-pump/90"
            onClick={activatePump}
            isActive={sensorData.pump}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
