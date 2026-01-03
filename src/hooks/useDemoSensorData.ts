import { useState, useEffect } from "react";

export interface DemoDataPoint {
  timestamp: string;
  temperature: number;
  ph: number;
  tds: number;
}

export const useDemoSensorData = (days: 1 | 3 | 7) => {
  const [data, setData] = useState<DemoDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch("/demo-sensor-data.csv");
        if (!response.ok) {
          throw new Error("Failed to fetch demo data");
        }
        
        const csvText = await response.text();
        const lines = csvText.trim().split("\n");
        const headers = lines[0].split(",");
        
        const parsedData: DemoDataPoint[] = lines.slice(1).map((line) => {
          const values = line.split(",");
          return {
            timestamp: values[0],
            temperature: parseFloat(values[1]),
            ph: parseFloat(values[2]),
            tds: parseInt(values[3], 10),
          };
        });
        
        // Filter data based on selected days
        // Take the last N days of data (48 points per day with 30-min intervals)
        const pointsPerDay = 48;
        const totalPoints = days * pointsPerDay;
        const filteredData = parsedData.slice(-totalPoints);
        
        setData(filteredData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [days]);

  return { data, isLoading, error };
};
