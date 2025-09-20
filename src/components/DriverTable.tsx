import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge, BadgeIcon } from "@/components/Badge";
import { Driver, BadgeType } from "@/types/driver";
import { ArrowUpDown, Search, Trash2 } from "lucide-react";

interface DriverTableProps {
  drivers: Driver[];
  onDeleteDriver: (id: string) => void;
}

type SortField = "name" | "efficiency" | "distance" | "energyUsed";
type SortOrder = "asc" | "desc";

export function DriverTable({ drivers, onDeleteDriver }: DriverTableProps) {
  const [sortField, setSortField] = useState<SortField>("efficiency");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [badgeFilter, setBadgeFilter] = useState<BadgeType | "all">("all");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const filteredAndSortedDrivers = drivers
    .filter((driver) => {
      const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           driver.vehicle.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBadge = badgeFilter === "all" || driver.badge === badgeFilter;
      return matchesSearch && matchesBadge;
    })
    .sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;
      
      switch (sortField) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "efficiency":
          aValue = a.efficiency;
          bValue = b.efficiency;
          break;
        case "distance":
          aValue = a.distance;
          bValue = b.distance;
          break;
        case "energyUsed":
          aValue = a.energyUsed;
          bValue = b.energyUsed;
          break;
        default:
          return 0;
      }
      
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      
      return sortOrder === "asc" ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
    });

  if (drivers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Driver Efficiency Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No drivers added yet. Add your first driver to get started!
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Driver Efficiency Leaderboard</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search drivers or vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={badgeFilter} onValueChange={(value) => setBadgeFilter(value as BadgeType | "all")}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by badge" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Badges</SelectItem>
              <SelectItem value="Energy Saver">Energy Saver</SelectItem>
              <SelectItem value="Eco Driver">Eco Driver</SelectItem>
              <SelectItem value="Needs Improvement">Needs Improvement</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("name")}
                    className="h-auto p-0 font-semibold"
                  >
                    Name
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </Button>
                </th>
                <th className="text-left py-3 px-2">Vehicle</th>
                <th className="text-center py-3 px-2">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("distance")}
                    className="h-auto p-0 font-semibold"
                  >
                    Distance (km)
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </Button>
                </th>
                <th className="text-center py-3 px-2">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("energyUsed")}
                    className="h-auto p-0 font-semibold"
                  >
                    Energy (kWh)
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </Button>
                </th>
                <th className="text-center py-3 px-2">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("efficiency")}
                    className="h-auto p-0 font-semibold"
                  >
                    Score
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </Button>
                </th>
                <th className="text-center py-3 px-2">Badge</th>
                <th className="text-center py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedDrivers.map((driver, index) => (
                <tr key={driver.id} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-2">
                      {index < 3 && (
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                          index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                        }`}>
                          {index + 1}
                        </div>
                      )}
                      <span className="font-medium">{driver.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-muted-foreground">{driver.vehicle}</td>
                  <td className="py-4 px-2 text-center">{driver.distance.toFixed(1)}</td>
                  <td className="py-4 px-2 text-center">{driver.energyUsed.toFixed(1)}</td>
                  <td className="py-4 px-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <BadgeIcon type={driver.badge} size={14} />
                      <span className="font-semibold">{driver.efficiency.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-center">
                    <Badge type={driver.badge} size="sm" />
                  </td>
                  <td className="py-4 px-2 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteDriver(driver.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredAndSortedDrivers.length === 0 && drivers.length > 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No drivers match your current filters.
          </div>
        )}
      </CardContent>
    </Card>
  );
}