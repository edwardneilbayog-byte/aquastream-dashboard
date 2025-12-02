import { useState, useCallback } from 'react';

export interface SensorReading {
  id: string;
  timestamp: number;
  temp: number;
  ph: number;
  tds: number;
}

const STORAGE_KEY = 'aquastream_sensor_history';
const MAX_HISTORY_ITEMS = 20;

export const useSensorHistory = () => {
  const [history, setHistory] = useState<SensorReading[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const addReading = useCallback((reading: Omit<SensorReading, 'id' | 'timestamp'>) => {
    const newReading: SensorReading = {
      ...reading,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    setHistory(prev => {
      const updated = [newReading, ...prev].slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { history, addReading, clearHistory };
};
