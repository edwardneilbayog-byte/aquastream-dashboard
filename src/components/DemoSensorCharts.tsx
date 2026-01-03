import { useState } from "react";
import { useDemoSensorData } from "@/hooks/useDemoSensorData";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Thermometer, Droplets, Waves } from "lucide-react";
import { cn } from "@/lib/utils";

type TimeRange = 1 | 3 | 7;

const DemoSensorCharts = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>(1);
  const { data, isLoading, error } = useDemoSensorData(timeRange);

  const formatXAxis = (timestamp: string) => {
    const date = new Date(timestamp);
    if (timeRange === 1) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const formatTooltipTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (error) {
    return (
      <div className="glass-card p-6 text-center text-muted-foreground">
        Failed to load demo data: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-center gap-2">
        {([1, 3, 7] as TimeRange[]).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              timeRange === range
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {range}D
          </button>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Temperature Chart */}
        <div className="glass-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sensor-temp/10">
              <Thermometer className="h-4 w-4 text-sensor-temp" />
            </div>
            <span className="text-sm font-medium text-foreground">Temperature</span>
          </div>
          <div className="h-48">
            {isLoading ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Loading...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(15, 85%, 55%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(15, 85%, 55%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={formatXAxis}
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    domain={[25, 28]}
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}°`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const point = payload[0].payload as { timestamp: string; temperature: number };
                      return (
                        <div className="glass p-2 rounded-lg text-xs">
                          <p className="text-muted-foreground">{formatTooltipTime(point.timestamp)}</p>
                          <p className="font-medium text-sensor-temp">{point.temperature.toFixed(1)}°C</p>
                        </div>
                      );
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="temperature"
                    stroke="hsl(15, 85%, 55%)"
                    strokeWidth={2}
                    fill="url(#tempGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* pH Chart */}
        <div className="glass-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sensor-ph/10">
              <Droplets className="h-4 w-4 text-sensor-ph" />
            </div>
            <span className="text-sm font-medium text-foreground">pH Level</span>
          </div>
          <div className="h-48">
            {isLoading ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Loading...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="phGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(260, 65%, 55%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(260, 65%, 55%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={formatXAxis}
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    domain={[6, 8]}
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const point = payload[0].payload as { timestamp: string; ph: number };
                      return (
                        <div className="glass p-2 rounded-lg text-xs">
                          <p className="text-muted-foreground">{formatTooltipTime(point.timestamp)}</p>
                          <p className="font-medium text-sensor-ph">{point.ph.toFixed(2)} pH</p>
                        </div>
                      );
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="ph"
                    stroke="hsl(260, 65%, 55%)"
                    strokeWidth={2}
                    fill="url(#phGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* TDS Chart */}
        <div className="glass-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sensor-tds/10">
              <Waves className="h-4 w-4 text-sensor-tds" />
            </div>
            <span className="text-sm font-medium text-foreground">TDS</span>
          </div>
          <div className="h-48">
            {isLoading ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Loading...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="tdsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(170, 60%, 45%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(170, 60%, 45%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={formatXAxis}
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    domain={[300, 600]}
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const point = payload[0].payload as { timestamp: string; tds: number };
                      return (
                        <div className="glass p-2 rounded-lg text-xs">
                          <p className="text-muted-foreground">{formatTooltipTime(point.timestamp)}</p>
                          <p className="font-medium text-sensor-tds">{point.tds} ppm</p>
                        </div>
                      );
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="tds"
                    stroke="hsl(170, 60%, 45%)"
                    strokeWidth={2}
                    fill="url(#tdsGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Note */}
      <p className="text-center text-xs text-muted-foreground">
        Demo data for presentation purposes • Edit <code className="bg-secondary px-1 rounded">public/demo-sensor-data.csv</code> to customize
      </p>
    </div>
  );
};

export default DemoSensorCharts;
