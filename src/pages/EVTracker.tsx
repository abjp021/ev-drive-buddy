import { useState, useEffect } from "react";
import { Driver } from "@/types/driver";
import { DriverForm } from "@/components/DriverForm";
import { DriverTable } from "@/components/DriverTable";
import { StatsCards } from "@/components/StatsCards";
import { Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "ev-tracker-drivers";

export default function EVTracker() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const { toast } = useToast();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedDrivers = localStorage.getItem(STORAGE_KEY);
    if (savedDrivers) {
      try {
        setDrivers(JSON.parse(savedDrivers));
      } catch (error) {
        console.error("Error loading saved drivers:", error);
      }
    }
  }, []);

  // Save to localStorage whenever drivers change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drivers));
  }, [drivers]);

  const addDriver = (driverData: Omit<Driver, 'id'>) => {
    const newDriver: Driver = {
      ...driverData,
      id: `driver-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    
    setDrivers(prev => [...prev, newDriver]);
    
    toast({
      title: "Driver Added Successfully!",
      description: `${newDriver.name} has been added with a ${newDriver.badge} badge.`,
    });
  };

  const deleteDriver = (id: string) => {
    const driver = drivers.find(d => d.id === id);
    setDrivers(prev => prev.filter(d => d.id !== id));
    
    if (driver) {
      toast({
        title: "Driver Removed",
        description: `${driver.name} has been removed from the tracker.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-primary rounded-xl">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              EV Efficiency Tracker
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track your electric vehicle's efficiency, earn badges, and compete with other eco-conscious drivers
          </p>
        </div>

        {/* Stats Cards */}
        <StatsCards drivers={drivers} />

        <div className="mt-8 space-y-8">
          {/* Driver Form */}
          <DriverForm onAddDriver={addDriver} />

          {/* Driver Table */}
          <DriverTable drivers={drivers} onDeleteDriver={deleteDriver} />
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>Data is stored locally in your browser. Clear your browser data to reset.</p>
        </div>
      </div>
    </div>
  );
}