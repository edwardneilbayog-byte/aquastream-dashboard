import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAutomationSettings } from './useAutomationSettings';
import { useAutomationHistory } from './useAutomationHistory';
import { useDeviceSettings } from './useDeviceSettings';
import { useSensorHistory } from './useSensorHistory';

interface SensorData {
  temp: number;
  ph: number;
  tds: number;
  pumpIn: boolean;
  pumpOut: boolean;
  feeder: boolean;
  leak: boolean;
}

export const useESP32Control = () => {
  const { toast } = useToast();
  const { settings } = useAutomationSettings();
  const { addEvent } = useAutomationHistory();
  const { settings: deviceSettings } = useDeviceSettings();
  const { addReading } = useSensorHistory();
  const lastReadingRef = useRef<number>(0);
  const lastLeakStateRef = useRef<boolean>(false);
  
  const [sensorData, setSensorData] = useState<SensorData>({
    temp: 0,
    ph: 0,
    tds: 0,
    pumpIn: false,
    pumpOut: false,
    feeder: false,
    leak: false
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
        description: `${command.replace('_', ' ')} ${value ? 'activated' : 'deactivated'}`,
      });

      // Update local state based on command
      setSensorData(prev => {
        if (command === 'master_pump') {
          return { ...prev, pumpIn: value, pumpOut: value };
        } else if (command === 'pump_in') {
          return { ...prev, pumpIn: value };
        } else if (command === 'pump_out') {
          return { ...prev, pumpOut: value };
        } else if (command === 'feeder') {
          return { ...prev, feeder: value };
        }
        return prev;
      });

    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to control ${command.replace('_', ' ')}. Check ESP32 connection.`,
        variant: "destructive",
      });
      console.error('Control error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [toast, deviceSettings.esp32Url]);

  // Feeder controls
  const activateFeeder = useCallback(() => {
    sendCommand('feeder', true);
    addEvent({ type: 'manual_feeder_on' });
  }, [sendCommand, addEvent]);

  const deactivateFeeder = useCallback(() => {
    sendCommand('feeder', false);
    addEvent({ type: 'manual_feeder_off' });
  }, [sendCommand, addEvent]);

  // Pump In controls
  const activatePumpIn = useCallback(() => {
    sendCommand('pump_in', true);
    addEvent({ type: 'manual_pump_in_on' });
  }, [sendCommand, addEvent]);

  const deactivatePumpIn = useCallback(() => {
    sendCommand('pump_in', false);
    addEvent({ type: 'manual_pump_in_off' });
  }, [sendCommand, addEvent]);

  // Pump Out controls
  const activatePumpOut = useCallback(() => {
    sendCommand('pump_out', true);
    addEvent({ type: 'manual_pump_out_on' });
  }, [sendCommand, addEvent]);

  const deactivatePumpOut = useCallback(() => {
    sendCommand('pump_out', false);
    addEvent({ type: 'manual_pump_out_off' });
  }, [sendCommand, addEvent]);

  // Master Pump controls (both pumps)
  const activateMasterPump = useCallback(() => {
    sendCommand('master_pump', true);
    addEvent({ type: 'manual_master_pump_on' });
  }, [sendCommand, addEvent]);

  const deactivateMasterPump = useCallback(() => {
    sendCommand('master_pump', false);
    addEvent({ type: 'manual_master_pump_off' });
  }, [sendCommand, addEvent]);

  const fetchSensorData = useCallback(async () => {
    try {
      const response = await fetch(`${deviceSettings.esp32Url}/aquastream-dashboard/sensor_value.json`, {
        mode: 'cors',
      });
      
      if (response.ok) {
        const data = await response.json();
        const newTemp = parseFloat(data.temp) || 0;
        const newPh = parseFloat(data.ph) || 0;
        const newTds = parseFloat(data.tds) || 0;
        const newPumpIn = data.pump_in === '1';
        const newPumpOut = data.pump_out === '1';
        const newLeak = data.leak === '1';
        const currentTime = Date.now();
        
        // Add to sensor history (limit to once per 30 seconds)
        if (currentTime - lastReadingRef.current >= 30000) {
          lastReadingRef.current = currentTime;
          addReading({ temp: newTemp, ph: newPh, tds: newTds });
        }

        // Check for leak state change
        if (newLeak !== lastLeakStateRef.current) {
          lastLeakStateRef.current = newLeak;
          if (newLeak) {
            addEvent({ type: 'leak_detected' });
          } else {
            addEvent({ type: 'leak_cleared' });
          }
        }
        
        setSensorData(prev => {
          const updated: SensorData = {
            temp: newTemp,
            ph: newPh,
            tds: newTds,
            pumpIn: newPumpIn,
            pumpOut: newPumpOut,
            feeder: data.feeder === '1',
            leak: newLeak
          };
          
          // Smart Water Change Automation
          const timeSinceLastActivation = currentTime - lastAutoActivation;
          const cooldownMs = settings.cooldownPeriod * 60 * 1000;
          const canAutoActivate = timeSinceLastActivation >= cooldownMs || lastAutoActivation === 0;
          
          // Check if any sensor is out of safe range
          const tempOutOfRange = newTemp < settings.tempMin || newTemp > settings.tempMax;
          const phOutOfRange = newPh < settings.phMin || newPh > settings.phMax;
          const tdsOutOfRange = newTds < settings.tdsMin || newTds > settings.tdsMax;
          
          // Determine trigger reason
          let trigger: 'ph' | 'temp' | 'tds' | undefined;
          if (tempOutOfRange) trigger = 'temp';
          else if (phOutOfRange) trigger = 'ph';
          else if (tdsOutOfRange) trigger = 'tds';
          
          const shouldTriggerWaterChange = 
            settings.enabled &&
            (tempOutOfRange || phOutOfRange || tdsOutOfRange) &&
            !newPumpIn && 
            !newPumpOut && 
            !prev.pumpIn &&
            !prev.pumpOut &&
            canAutoActivate;
          
          if (shouldTriggerWaterChange && trigger) {
            console.log(`Water Change Automation triggered: ${trigger} out of range`);
            setLastAutoActivation(currentTime);
            sendCommand('master_pump', true);
            
            // Log auto water change event
            addEvent({ 
              type: 'auto_water_change', 
              ph: newPh,
              temp: newTemp,
              tds: newTds,
              duration: settings.waterChangeDuration,
              trigger
            });
            
            // Auto turn off after configured duration
            setTimeout(() => {
              sendCommand('master_pump', false);
            }, settings.waterChangeDuration * 1000);
            
            const triggerMessage = trigger === 'temp' 
              ? `Temperature ${newTemp.toFixed(1)}°C out of safe range (${settings.tempMin}-${settings.tempMax}°C)`
              : trigger === 'ph'
              ? `pH ${newPh.toFixed(2)} out of safe range (${settings.phMin}-${settings.phMax})`
              : `TDS ${newTds} ppm out of safe range (${settings.tdsMin}-${settings.tdsMax} ppm)`;
            
            toast({
              title: "Water Change Activated",
              description: `${triggerMessage}. Both pumps running for ${settings.waterChangeDuration} seconds.`,
            });
          }
          
          return updated;
        });
      }
    } catch (error) {
      console.error('Failed to fetch sensor data:', error);
    }
  }, [sendCommand, toast, lastAutoActivation, settings, addEvent, deviceSettings.esp32Url, addReading]);

  return {
    sensorData,
    isLoading,
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
  };
};
