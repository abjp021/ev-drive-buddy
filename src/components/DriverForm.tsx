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
  onClose?: () => void;
  existingDrivers?: Driver[];
}

export function DriverForm({ onAddDriver, onClose, existingDrivers = [] }: DriverFormProps) {
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
      energyUsed,
      existingDrivers
    );

    onAddDriver(driverData);
    
    setFormData({
      name: "",
      vehicle: "",
      distance: "",
      energyUsed: "",
    });

    // Auto-close modal after successful addition
    setTimeout(() => {
      if (onClose) onClose();
    }, 1000);
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Plus className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Add New Driver</h3>
        <p className="text-gray-600">
          Enter driver details to calculate efficiency score and assign badges
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Driver Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter driver name"
                value={formData.name}
                onChange={handleInputChange("name")}
                required
                className="h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="vehicle" className="text-sm font-semibold text-gray-700">Vehicle Model</Label>
              <Input
                id="vehicle"
                type="text"
                placeholder="e.g., Tesla Model 3"
                value={formData.vehicle}
                onChange={handleInputChange("vehicle")}
                required
                className="h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="distance" className="text-sm font-semibold text-gray-700">Distance Covered (km)</Label>
              <Input
                id="distance"
                type="number"
                step="0.1"
                min="0"
                placeholder="Enter distance"
                value={formData.distance}
                onChange={handleInputChange("distance")}
                required
                className="h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="energy" className="text-sm font-semibold text-gray-700">Energy Used (kWh)</Label>
              <Input
                id="energy"
                type="number"
                step="0.1"
                min="0"
                placeholder="Enter energy used"
                value={formData.energyUsed}
                onChange={handleInputChange("energyUsed")}
                required
                className="h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-semibold"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Driver
          </Button>
        </form>
    </div>
  );
}