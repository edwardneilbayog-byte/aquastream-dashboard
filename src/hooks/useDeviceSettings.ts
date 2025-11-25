import { useState, useEffect } from 'react';

export interface DeviceSettings {
  esp32Url: string;
  cameraUrl: string;
}

const DEFAULT_SETTINGS: DeviceSettings = {
  esp32Url: 'http://192.168.1.150',
  cameraUrl: 'http://192.168.1.151',
};

const STORAGE_KEY = 'aquastream_device_settings';

export const useDeviceSettings = () => {
  const [settings, setSettings] = useState<DeviceSettings>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
  });

  const updateSettings = (newSettings: Partial<DeviceSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
  };

  return { settings, updateSettings, resetSettings };
};
