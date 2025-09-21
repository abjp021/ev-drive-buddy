import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Driver } from "@/types/driver";
import { Zap } from "lucide-react";

interface EfficiencyChartProps {
  drivers: Driver[];
}

const chartConfig = {
  score: {
    label: "Efficiency Score",
    color: "hsl(var(--primary))",
  },
};

export function EfficiencyChart({ drivers }: EfficiencyChartProps) {
  // Prepare data for the chart - top 8 drivers
  const chartData = drivers
    .sort((a, b) => b.normalizedEfficiency - a.normalizedEfficiency)
    .slice(0, 8)
    .map((driver) => ({
      name: driver.name.length > 8 ? `${driver.name.substring(0, 8)}...` : driver.name,
      fullName: driver.name,
      score: driver.normalizedEfficiency,
      vehicle: driver.vehicle,
      badge: driver.badge,
    }));

  // Calculate dynamic Y-axis domain with minimal padding
  const scores = chartData.map(d => d.score);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  
  // Minimal padding for better visual balance
  const padding = maxScore === minScore ? 5 : Math.max(2, (maxScore - minScore) * 0.05);
  const yAxisMin = Math.max(0, minScore - padding);
  const yAxisMax = Math.min(100, maxScore + padding);

  if (drivers.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Efficiency Chart</h2>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Zap className="h-8 w-8 text-gray-400" />
            </div>
            <p className="font-medium">No data yet</p>
            <p className="text-sm text-gray-400">Add drivers to see the efficiency chart</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-bold mb-3 text-gray-800 flex items-center gap-2">
        <Zap className="h-10 w-5 text-emerald-500" />
        Driver Performance Scores
      </h2>
      <ChartContainer config={chartConfig} className="h-64">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 35, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 10, fill: '#6b7280' }}
            angle={-30}
            textAnchor="end"
            height={35}
            interval={0}
          />
          <YAxis 
            domain={[yAxisMin, yAxisMax]}
            tick={{ fontSize: 10, fill: '#6b7280' }}
            width={35}
          />
          <ChartTooltip 
            content={<ChartTooltipContent />}
            formatter={(value, name, props) => [
              `${value} points`,
              `Driver: ${props.payload.fullName}\nVehicle: ${props.payload.vehicle}\nBadge: ${props.payload.badge}`
            ]}
          />
          <Line 
            type="monotone"
            dataKey="score" 
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8, stroke: '#059669', strokeWidth: 2 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
