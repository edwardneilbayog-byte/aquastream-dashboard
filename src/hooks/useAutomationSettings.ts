import { useState } from 'react';

export interface AutomationSettings {
  enabled: boolean;
  // pH thresholds (trigger water change when outside safe range)
  phMin: number;
  phMax: number;
  // Temperature thresholds (safe range for fish)
  tempMin: number;
  tempMax: number;
  // TDS thresholds (safe range for fish)
  tdsMin: number;
  tdsMax: number;
  // Water change duration in seconds
  waterChangeDuration: number;
  // Cooldown period in minutes
  cooldownPeriod: number;
  // Feeder automation
  feederEnabled: boolean;
  feederIntervalHours: number;
}

const DEFAULT_SETTINGS: AutomationSettings = {
  enabled: true,
  phMin: 6.5,
  phMax: 7.5,
  tempMin: 24,
  tempMax: 28,
  tdsMin: 150,
  tdsMax: 400,
  waterChangeDuration: 60, // 1 minute
  cooldownPeriod: 60, // 1 hour
  feederEnabled: true,
  feederIntervalHours: 24,
};

const STORAGE_KEY = 'aquastream_automation_settings';

export const useAutomationSettings = () => {
  const [settings, setSettings] = useState<AutomationSettings>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      // Merge with defaults to handle new fields
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
    return DEFAULT_SETTINGS;
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

  return { settings, updateSettings, resetSettings, DEFAULT_SETTINGS };
};
