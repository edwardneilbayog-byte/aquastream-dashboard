import { useState, useCallback } from 'react';

export interface HistoryEvent {
  id: string;
  timestamp: number;
  type: 
    | 'auto_water_change'
    | 'auto_feeder_triggered'
    | 'manual_pump_in_on' 
    | 'manual_pump_in_off'
    | 'manual_pump_out_on'
    | 'manual_pump_out_off'
    | 'manual_master_pump_on'
    | 'manual_master_pump_off'
    | 'manual_feeder_on' 
    | 'manual_feeder_off'
    | 'leak_detected'
    | 'leak_cleared'
    | 'overflow_detected'
    | 'overflow_cleared'
    | 'overflow_pump_stopped';
  ph?: number;
  temp?: number;
  tds?: number;
  duration?: number;
  trigger?: 'ph' | 'temp' | 'tds';
}

const STORAGE_KEY = 'aquastream_automation_history';
const MAX_HISTORY_ITEMS = 100;

export const useAutomationHistory = () => {
  const [history, setHistory] = useState<HistoryEvent[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const addEvent = useCallback((event: Omit<HistoryEvent, 'id' | 'timestamp'>) => {
    const newEvent: HistoryEvent = {
      ...event,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    setHistory(prev => {
      const updated = [newEvent, ...prev].slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { history, addEvent, clearHistory };
};
