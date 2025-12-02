import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAutomationSettings } from './useAutomationSettings';
import { useAutomationHistory } from './useAutomationHistory';
import { useDeviceSettings } from './useDeviceSettings';

interface SensorData {
  temp: number;
  ph: number;
  tds: number;
  pump: boolean;
  feeder: boolean;
}

export const useESP32Control = () => {
  const { toast } = useToast();
  const { settings } = useAutomationSettings();
  const { addEvent } = useAutomationHistory();
  const { settings: deviceSettings } = useDeviceSettings();
  
  const [sensorData, setSensorData] = useState<SensorData>({
    temp: 0,
    ph: 0,
    tds: 0,
    pump: false,
    feeder: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lastAutoActivation, setLastAutoActivation] = useState<number>(0);

  const sendCommand = useCallback(async (command: string, value: boolean) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${deviceSettings.esp32Url}/control`, {
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
  }, [toast, deviceSettings.esp32Url]);

  const activateFeeder = useCallback(() => {
    sendCommand('feeder', true);
    addEvent({ type: 'manual_feeder_on' });
  }, [sendCommand, addEvent]);

  const deactivateFeeder = useCallback(() => {
    sendCommand('feeder', false);
    addEvent({ type: 'manual_feeder_off' });
  }, [sendCommand, addEvent]);

  const activatePump = useCallback(() => {
    sendCommand('pump', true);
    addEvent({ 
      type: 'manual_pump_on', 
      ph: sensorData.ph 
    });
  }, [sendCommand, addEvent, sensorData.ph]);

  const deactivatePump = useCallback(() => {
    sendCommand('pump', false);
    addEvent({ type: 'manual_pump_off' });
  }, [sendCommand, addEvent]);

  const fetchSensorData = useCallback(async () => {
    try {
      const response = await fetch(`${deviceSettings.esp32Url}/aquastream-dashboard/sensor_value.json`, {
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
          
          // pH Automation: Turn on pump based on configured settings
          const timeSinceLastActivation = currentTime - lastAutoActivation;
          const cooldownMs = settings.cooldownPeriod * 60 * 1000;
          const canAutoActivate = timeSinceLastActivation >= cooldownMs || lastAutoActivation === 0;
          
          if (
            settings.enabled &&
            newPh >= settings.phMin && 
            newPh <= settings.phMax && 
            !newPumpState && 
            !prev.pump && 
            canAutoActivate
          ) {
            console.log(`pH Automation triggered: pH ${newPh} detected, activating pump`);
            setLastAutoActivation(currentTime);
            sendCommand('pump', true);
            
            // Log auto activation
            addEvent({ 
              type: 'auto_pump', 
              ph: newPh, 
              duration: settings.pumpDuration 
            });
            
            // Auto turn off after configured duration
            setTimeout(() => {
              sendCommand('pump', false);
            }, settings.pumpDuration * 1000);
            
            toast({
              title: "pH Automation Activated",
              description: `pH level ${newPh.toFixed(2)} detected. Water pump activated for ${settings.pumpDuration} seconds.`,
            });
          } else if (newPh >= settings.phMin && newPh <= settings.phMax && !canAutoActivate) {
            const remainingTime = Math.ceil((cooldownMs - timeSinceLastActivation) / 60000);
            console.log(`pH Automation on cooldown. ${remainingTime} minutes remaining.`);
          }
          
          return updated;
        });
      }
    } catch (error) {
      console.error('Failed to fetch sensor data:', error);
    }
  }, [sendCommand, toast, lastAutoActivation, settings, addEvent, deviceSettings.esp32Url]);

  return {
    sensorData,
    isLoading,
    activateFeeder,
    deactivateFeeder,
    activatePump,
    deactivatePump,
    fetchSensorData,
    lastAutoActivation
  };
};
