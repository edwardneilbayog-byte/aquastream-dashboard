import { useState, useEffect } from "react";

export type TimeRange = "6h" | "12h" | "1d" | "3d" | "7d";

export interface DemoDataPoint {
  timestamp: string;
  temperature: number;
  ph: number;
  tds: number;
}

const getPointsForRange = (range: TimeRange): number => {
  const pointsPerHour = 2; // 30-min intervals
  switch (range) {
    case "6h":
      return 6 * pointsPerHour;
    case "12h":
      return 12 * pointsPerHour;
    case "1d":
      return 24 * pointsPerHour;
    case "3d":
      return 3 * 24 * pointsPerHour;
    case "7d":
      return 7 * 24 * pointsPerHour;
  }
};

export const useDemoSensorData = (range: TimeRange) => {
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
        
        const parsedData: DemoDataPoint[] = lines.slice(1).map((line) => {
          const values = line.split(",");
          return {
            timestamp: values[0],
            temperature: parseFloat(values[1]),
            ph: parseFloat(values[2]),
            tds: parseInt(values[3], 10),
          };
        });
        
        // Filter data based on selected range
        const totalPoints = getPointsForRange(range);
        const filteredData = parsedData.slice(-totalPoints);
        
        setData(filteredData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [range]);

  return { data, isLoading, error };
};
