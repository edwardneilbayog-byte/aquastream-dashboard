import { useState, useEffect, useCallback } from 'react';

export interface HistoryEvent {
  id: string;
  timestamp: number;
  type: 'auto_pump' | 'manual_pump_on' | 'manual_pump_off' | 'manual_feeder_on' | 'manual_feeder_off';
  ph?: number;
  duration?: number; // in seconds
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
