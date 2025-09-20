import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Driver } from "@/types/driver";
import { processDriverData } from "@/utils/calculations";

interface DriverFormProps {
  onAddDriver: (driver: Omit<Driver, 'id'>) => void;
}

export function DriverForm({ onAddDriver }: DriverFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    vehicle: "",
    distance: "",
    energyUsed: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.vehicle || !formData.distance || !formData.energyUsed) {
      return;
    }

    const distance = parseFloat(formData.distance);
    const energyUsed = parseFloat(formData.energyUsed);

    if (distance <= 0 || energyUsed <= 0) {
      return;
    }

    const driverData = processDriverData(
      formData.name,
      formData.vehicle,
      distance,
      energyUsed
    );

    onAddDriver(driverData);
    
    setFormData({
      name: "",
      vehicle: "",
      distance: "",
      energyUsed: "",
    });
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Driver
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Driver Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter driver name"
                value={formData.name}
                onChange={handleInputChange("name")}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vehicle">Vehicle Model</Label>
              <Input
                id="vehicle"
                type="text"
                placeholder="e.g., Tesla Model 3"
                value={formData.vehicle}
                onChange={handleInputChange("vehicle")}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="distance">Distance Covered (km)</Label>
              <Input
                id="distance"
                type="number"
                step="0.1"
                min="0"
                placeholder="Enter distance"
                value={formData.distance}
                onChange={handleInputChange("distance")}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="energy">Energy Used (kWh)</Label>
              <Input
                id="energy"
                type="number"
                step="0.1"
                min="0"
                placeholder="Enter energy used"
                value={formData.energyUsed}
                onChange={handleInputChange("energyUsed")}
                required
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Driver
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}