import { useState, useEffect } from "react";
import { Driver } from "@/types/driver";
import { DriverForm } from "@/components/DriverForm";
import { DriverTable } from "@/components/DriverTable";
import { StatsCards } from "@/components/StatsCards";
import { EfficiencyChart } from "@/components/EfficiencyChart";
import { ExcelUpload } from "@/components/ExcelUpload";
import { Modal } from "@/components/Modal";
import { ActionButtons } from "@/components/ActionButtons";
import { Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { calculateNormalizedEfficiency, getBadgeType } from "@/utils/calculations";

const STORAGE_KEY = "ev-tracker-drivers";

export default function EVTracker() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAddDriverModalOpen, setIsAddDriverModalOpen] = useState(false);
  const { toast } = useToast();

  // Function to recalculate normalized efficiency for all drivers
  const recalculateNormalizedEfficiency = (driverList: Driver[]): Driver[] => {
    if (driverList.length === 0) return driverList;
    
    const normalizedDrivers = calculateNormalizedEfficiency(driverList);
    return normalizedDrivers.map(driver => ({
      ...driver,
      badge: getBadgeType(driver.normalizedEfficiency)
    }));
  };

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
    
    setDrivers(prev => {
      const updatedDrivers = [...prev, newDriver];
      return recalculateNormalizedEfficiency(updatedDrivers);
    });
    
    toast({
      title: "Driver Added Successfully!",
      description: `${newDriver.name} has been added with a ${newDriver.badge} badge.`,
    });
  };

  const deleteDriver = (id: string) => {
    const driver = drivers.find(d => d.id === id);
    setDrivers(prev => {
      const filteredDrivers = prev.filter(d => d.id !== id);
      return recalculateNormalizedEfficiency(filteredDrivers);
    });
    
    if (driver) {
      toast({
        title: "Driver Removed",
        description: `${driver.name} has been removed from the tracker.`,
        variant: "destructive",
      });
    }
  };

  const bulkImportDrivers = (importedDrivers: Omit<Driver, 'id'>[]) => {
    const newDrivers: Driver[] = importedDrivers.map(driver => ({
      ...driver,
      id: `driver-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }));
    
    setDrivers(prev => {
      const updatedDrivers = [...prev, ...newDrivers];
      return recalculateNormalizedEfficiency(updatedDrivers);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg">
                <Zap className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-white drop-shadow-lg">
                EV Drive Buddy
              </h1>
            </div>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Track your electric vehicle's efficiency, earn badges, and compete with other eco-conscious drivers. 
              Make every mile count towards a greener future.
            </p>
            
            {/* Action Buttons */}
            <ActionButtons 
              onOpenUploadModal={() => setIsUploadModalOpen(true)}
              onOpenAddDriverModal={() => setIsAddDriverModalOpen(true)}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 -mt-4">
        {/* Optimized Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          {/* Left Sidebar - Stats and Quick Insights */}
          <div className="lg:col-span-4 space-y-4">
            {/* Stats Cards - Compact Design */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg p-4 hover:shadow-xl transition-all duration-300">
              <StatsCards drivers={drivers} />
            </div>
            
            {/* Compact Leaderboard */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg p-4 hover:shadow-xl transition-all duration-300 h-80">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
                <div className="p-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-md">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                Top Performers
              </h3>
              {drivers.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {drivers
                    .sort((a, b) => b.efficiency - a.efficiency)
                    .map((driver, index) => (
                      <div key={driver.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:shadow-sm transition-all duration-200">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-md ${
                            index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white' :
                            index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-white' :
                            index === 2 ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white' :
                            'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-gray-800">{driver.name}</p>
                            <p className="text-xs text-gray-500">{driver.vehicle}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-gray-800">{driver.efficiency}</p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                    <Zap className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm font-medium">No drivers yet</p>
                </div>
              )}
            </div>

            {/* Compact Badge Distribution */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg p-4 hover:shadow-xl transition-all duration-300 h-64">
              <h3 className="text-lg font-bold mb-4 text-gray-800">Badge Overview</h3>
              {drivers.length > 0 ? (
                <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
                  {['Energy Saver', 'Eco Driver', 'Needs Improvement'].map((badge) => {
                    const count = drivers.filter(d => d.badge === badge).length;
                    const percentage = drivers.length > 0 ? (count / drivers.length) * 100 : 0;
                    return (
                      <div key={badge} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm text-gray-700">{badge}</span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-2 rounded-full transition-all duration-700 ease-out ${
                              badge === 'Energy Saver' ? 'bg-gradient-to-r from-green-400 to-green-500' :
                              badge === 'Eco Driver' ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                              'bg-gradient-to-r from-red-400 to-red-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                    <Zap className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm font-medium">No data yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            {/* Driver Table - Full Width */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-100">
              <DriverTable drivers={drivers} onDeleteDriver={deleteDriver} />
            </div>

            {/* Efficiency Chart - Full Width */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg p-2 hover:shadow-xl transition-all duration-300">
              <EfficiencyChart drivers={drivers} />
            </div>

          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="mt-16 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6 max-w-2xl mx-auto">
            <p className="text-gray-600 font-medium">
              💾 Data is stored locally in your browser. Clear your browser data to reset.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Built with ❤️ for eco-conscious drivers
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Trips Data"
      >
        <ExcelUpload 
          onDriversImported={bulkImportDrivers}
          onClose={() => setIsUploadModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isAddDriverModalOpen}
        onClose={() => setIsAddDriverModalOpen(false)}
        title="Add Trip Data Individually"
      >
        <DriverForm 
          onAddDriver={addDriver}
          onClose={() => setIsAddDriverModalOpen(false)}
          existingDrivers={drivers}
        />
      </Modal>
    </div>
  );
}