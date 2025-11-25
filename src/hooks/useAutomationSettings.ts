import { useState, useEffect } from 'react';

export interface AutomationSettings {
  enabled: boolean;
  phMin: number;
  phMax: number;
  pumpDuration: number; // in seconds
  cooldownPeriod: number; // in minutes
}

const DEFAULT_SETTINGS: AutomationSettings = {
  enabled: true,
  phMin: 5.0,
  phMax: 6.0,
  pumpDuration: 30,
  cooldownPeriod: 60, // 1 hour
};

const STORAGE_KEY = 'aquastream_automation_settings';

export const useAutomationSettings = () => {
  const [settings, setSettings] = useState<AutomationSettings>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
  });

  const updateSettings = (newSettings: Partial<AutomationSettings>) => {
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
