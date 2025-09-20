import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Driver } from "@/types/driver";
import { Users, Zap, TrendingUp, Award } from "lucide-react";

interface StatsCardsProps {
  drivers: Driver[];
}

export function StatsCards({ drivers }: StatsCardsProps) {
  const totalDrivers = drivers.length;
  const averageEfficiency = drivers.length > 0 
    ? drivers.reduce((sum, driver) => sum + driver.efficiency, 0) / drivers.length 
    : 0;
  const topDriver = drivers.length > 0 
    ? drivers.reduce((top, driver) => driver.efficiency > top.efficiency ? driver : top)
    : null;
  const energySavers = drivers.filter(driver => driver.badge === "Energy Saver").length;

  const stats = [
    {
      title: "Total Drivers",
      value: totalDrivers.toString(),
      icon: Users,
      description: "Registered drivers",
    },
    {
      title: "Average Efficiency",
      value: averageEfficiency.toFixed(1),
      icon: TrendingUp,
      description: "Points average",
    },
    {
      title: "Top Performer",
      value: topDriver ? `${topDriver.efficiency.toFixed(1)}` : "—",
      icon: Award,
      description: topDriver ? topDriver.name : "No data yet",
    },
    {
      title: "Energy Savers",
      value: energySavers.toString(),
      icon: Zap,
      description: "8+ km/kWh achievers",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}