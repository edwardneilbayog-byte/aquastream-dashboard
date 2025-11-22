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
    // Auto turn off after 10 seconds
    setTimeout(() => {
      sendCommand('pump', false);
    }, 10000);
  }, [sendCommand]);

  const fetchSensorData = useCallback(async () => {
    try {
      const response = await fetch(`http://${ESP32_IP}/aquastream-dashboard/sensor_value.json`, {
        mode: 'cors',
      });
      
      if (response.ok) {
        const data = await response.json();
        setSensorData({
          temp: parseFloat(data.temp) || 0,
          ph: parseFloat(data.ph) || 0,
          tds: parseFloat(data.tds) || 0,
          pump: data.pump === '1',
          feeder: data.feeder === '1'
        });
      }
    } catch (error) {
      console.error('Failed to fetch sensor data:', error);
    }
  }, []);

  return {
    sensorData,
    isLoading,
    activateFeeder,
    deactivateFeeder,
    activatePump,
    fetchSensorData
  };
};
