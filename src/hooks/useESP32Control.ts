import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface SensorData {
  temp: number;
  ph: number;
  tds: number;
  pump: boolean;
  feeder: boolean;
}

const ESP32_IP = "192.168.1.150";
const CONTROL_ENDPOINT = `http://${ESP32_IP}/control`;

export const useESP32Control = () => {
  const { toast } = useToast();
  const [sensorData, setSensorData] = useState<SensorData>({
    temp: 0,
    ph: 0,
    tds: 0,
    pump: false,
    feeder: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lastAutoActivation, setLastAutoActivation] = useState<number>(0);
  
  const ONE_HOUR_MS = 60 * 60 * 1000; // 1 hour in milliseconds

  const sendCommand = useCallback(async (command: string, value: boolean) => {
    setIsLoading(true);
    try {
      const response = await fetch(CONTROL_ENDPOINT, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `${command}=${value ? '1' : '0'}`,
      });

      if (!response.ok) {
        throw new Error('Failed to send command');
      }

      toast({
        title: "Command sent",
        description: `${command} ${value ? 'activated' : 'deactivated'}`,
      });

      // Update local state
      setSensorData(prev => ({
        ...prev,
        [command]: value
      }));

    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to control ${command}. Check ESP32 connection.`,
        variant: "destructive",
      });
      console.error('Control error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const activateFeeder = useCallback(() => {
    sendCommand('feeder', true);
  }, [sendCommand]);

  const deactivateFeeder = useCallback(() => {
    sendCommand('feeder', false);
  }, [sendCommand]);

  const activatePump = useCallback(() => {
    sendCommand('pump', true);
    // Auto turn off after 30 seconds
    setTimeout(() => {
      sendCommand('pump', false);
    }, 30000);
  }, [sendCommand]);

  const fetchSensorData = useCallback(async () => {
    try {
      const response = await fetch(`http://${ESP32_IP}/aquastream-dashboard/sensor_value.json`, {
        mode: 'cors',
      });
      
      if (response.ok) {
        const data = await response.json();
        const newPh = parseFloat(data.ph) || 0;
        const newPumpState = data.pump === '1';
        const currentTime = Date.now();
        
        setSensorData(prev => {
          const updated = {
            temp: parseFloat(data.temp) || 0,
            ph: newPh,
            tds: parseFloat(data.tds) || 0,
            pump: newPumpState,
            feeder: data.feeder === '1'
          };
          
          // pH Automation: Turn on pump if pH is between 5-6, pump is not running, and cooldown has elapsed
          const timeSinceLastActivation = currentTime - lastAutoActivation;
          const canAutoActivate = timeSinceLastActivation >= ONE_HOUR_MS || lastAutoActivation === 0;
          
          if (newPh >= 5 && newPh <= 6 && !newPumpState && !prev.pump && canAutoActivate) {
            console.log(`pH Automation triggered: pH ${newPh} detected, activating pump`);
            setLastAutoActivation(currentTime);
            sendCommand('pump', true);
            // Auto turn off after 30 seconds
            setTimeout(() => {
              sendCommand('pump', false);
            }, 30000);
            
            toast({
              title: "pH Automation Activated",
              description: `pH level ${newPh.toFixed(2)} detected. Water pump activated for 30 seconds.`,
            });
          } else if (newPh >= 5 && newPh <= 6 && !canAutoActivate) {
            const remainingTime = Math.ceil((ONE_HOUR_MS - timeSinceLastActivation) / 60000);
            console.log(`pH Automation on cooldown. ${remainingTime} minutes remaining.`);
          }
          
          return updated;
        });
      }
    } catch (error) {
      console.error('Failed to fetch sensor data:', error);
    }
  }, [sendCommand, toast, lastAutoActivation, ONE_HOUR_MS]);

  return {
    sensorData,
    isLoading,
    activateFeeder,
    deactivateFeeder,
    activatePump,
    fetchSensorData,
    lastAutoActivation
  };
};
