import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Driver } from "@/types/driver";
import { Users, Zap, TrendingUp, Award } from "lucide-react";

interface StatsCardsProps {
  drivers: Driver[];
}

export function StatsCards({ drivers }: StatsCardsProps) {
  const totalDrivers = drivers.length;
  const averageEfficiency = drivers.length > 0 
    ? drivers.reduce((sum, driver) => sum + driver.normalizedEfficiency, 0) / drivers.length 
    : 0;
  const topDriver = drivers.length > 0 
    ? drivers.reduce((top, driver) => driver.normalizedEfficiency > top.normalizedEfficiency ? driver : top)
    : null;
  const energySavers = drivers.filter(driver => driver.badge === "Energy Saver").length;

  const stats = [
    {
      title: "Total Drivers",
      value: totalDrivers.toString(),
      icon: Users,
      description: "Registered drivers",
      color: "blue",
      bgGradient: "from-blue-50 to-blue-100",
      iconColor: "text-blue-600",
      valueColor: "text-blue-700",
    },
    {
      title: "Avg Score",
      value: averageEfficiency.toFixed(0),
      icon: TrendingUp,
      description: "Average normalized score",
      color: "green",
      bgGradient: "from-green-50 to-green-100",
      iconColor: "text-green-600",
      valueColor: "text-green-700",
    },
    {
      title: "Top Score",
      value: topDriver ? `${topDriver.normalizedEfficiency}` : "—",
      icon: Award,
      description: topDriver ? `${topDriver.name} (Score)` : "No data yet",
      color: "yellow",
      bgGradient: "from-yellow-50 to-yellow-100",
      iconColor: "text-yellow-600",
      valueColor: "text-yellow-700",
    },
    {
      title: "Energy Savers",
      value: energySavers.toString(),
      icon: Zap,
      description: "8+ km/kWh achievers",
      color: "purple",
      bgGradient: "from-purple-50 to-purple-100",
      iconColor: "text-purple-600",
      valueColor: "text-purple-700",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, index) => (
        <div key={index} className={`bg-gradient-to-br ${stat.bgGradient} rounded-lg p-3 border border-gray-100 hover:shadow-md transition-all duration-200 hover:scale-105`}>
          <div className="flex items-center justify-between mb-2">
            <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
            <span className="text-xs font-medium text-gray-600">{stat.title}</span>
          </div>
          <div className={`text-xl font-bold ${stat.valueColor} mb-1`}>{stat.value}</div>
          <p className="text-xs text-gray-500 leading-tight">
            {stat.description}
          </p>
        </div>
      ))}
    </div>
  );
}