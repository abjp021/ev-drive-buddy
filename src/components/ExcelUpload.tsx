import { useState, useRef } from "react";
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";
import { Driver } from "@/types/driver";
import { calculateEfficiency, calculateNormalizedEfficiency, getBadgeType } from "@/utils/calculations";

interface ExcelUploadProps {
  onDriversImported: (drivers: Omit<Driver, 'id'>[]) => void;
  onClose?: () => void;
}

interface ParsedDriver {
  name: string;
  vehicle: string;
  distance: number;
  energyUsed: number;
  row: number;
}

export function ExcelUpload({ onDriversImported, onClose }: ExcelUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [successCount, setSuccessCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateDriverData = (data: any[], row: number): ParsedDriver | null => {
    const errors: string[] = [];

    // Check required fields
    if (!data[0] || typeof data[0] !== 'string' || data[0].trim() === '') {
      errors.push(`Row ${row}: Name is required`);
    }
    if (!data[1] || typeof data[1] !== 'string' || data[1].trim() === '') {
      errors.push(`Row ${row}: Vehicle is required`);
    }
    if (!data[2] || isNaN(Number(data[2])) || Number(data[2]) <= 0) {
      errors.push(`Row ${row}: Distance must be a positive number`);
    }
    if (!data[3] || isNaN(Number(data[3])) || Number(data[3]) <= 0) {
      errors.push(`Row ${row}: Energy Used must be a positive number`);
    }

    if (errors.length > 0) {
      setErrors(prev => [...prev, ...errors]);
      return null;
    }

    return {
      name: data[0].trim(),
      vehicle: data[1].trim(),
      distance: Number(data[2]),
      energyUsed: Number(data[3]),
      row
    };
  };

  const calculateEfficiencyScore = (distance: number, energy: number): number => {
    return calculateEfficiency(distance, energy);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setErrors([]);
    setSuccessCount(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      clearInterval(progressInterval);
      setUploadProgress(90);

      // Skip header row and process data
      const tempDrivers: Omit<Driver, 'id'>[] = [];
      const dataRows = jsonData.slice(1) as any[][]; // Skip header

      dataRows.forEach((row, index) => {
        const rowNumber = index + 2; // +2 because we skipped header and arrays are 0-indexed
        const parsedDriver = validateDriverData(row, rowNumber);
        
        if (parsedDriver) {
          const efficiency = calculateEfficiencyScore(parsedDriver.distance, parsedDriver.energyUsed);
          
          tempDrivers.push({
            name: parsedDriver.name,
            vehicle: parsedDriver.vehicle,
            distance: parsedDriver.distance,
            energyUsed: parsedDriver.energyUsed,
            efficiency,
            normalizedEfficiency: 0, // Will be calculated
            badge: 'Needs Improvement' // Will be recalculated
          });
        }
      });

      // Calculate normalized efficiency for all drivers
      const driversWithNormalizedEfficiency = calculateNormalizedEfficiency(
        tempDrivers.map(driver => ({ ...driver, id: 'temp' }))
      );

      // Assign badges based on normalized efficiency
      const drivers = driversWithNormalizedEfficiency.map(driver => ({
        name: driver.name,
        vehicle: driver.vehicle,
        distance: driver.distance,
        energyUsed: driver.energyUsed,
        efficiency: driver.efficiency,
        normalizedEfficiency: driver.normalizedEfficiency,
        badge: getBadgeType(driver.normalizedEfficiency)
      }));

      setUploadProgress(100);
      setSuccessCount(drivers.length);

      if (drivers.length > 0) {
        onDriversImported(drivers);
        toast({
          title: "Import Successful!",
          description: `${drivers.length} drivers imported successfully.`,
        });
        // Auto-close modal after successful import
        setTimeout(() => {
          if (onClose) onClose();
        }, 1500);
      } else {
        toast({
          title: "No Valid Drivers Found",
          description: "Please check your Excel file format and try again.",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Error parsing Excel file:', error);
      toast({
        title: "Import Failed",
        description: "There was an error reading the Excel file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      ['Name', 'Vehicle', 'Distance (km)', 'Energy Used (kWh)'],
      ['John Doe', 'Tesla Model 3', '400', '50'],
      ['Jane Smith', 'Nissan Leaf', '200', '40'],
      ['Bob Johnson', 'BMW i3', '150', '45']
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Drivers');

    XLSX.writeFile(workbook, 'EV_Drivers_Template.xlsx');
    
    toast({
      title: "Template Downloaded",
      description: "Excel template has been downloaded to your device.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
          <FileSpreadsheet className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Bulk Import Drivers</h3>
        <p className="text-gray-600">
          Upload an Excel file to import multiple drivers at once. Download the template to see the required format.
        </p>
      </div>
        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 bg-gradient-to-br from-gray-50 to-white">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading}
          />
          
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Upload className="h-8 w-8 text-white" />
            </div>
            
            <div>
              <p className="text-lg font-semibold text-gray-800">
                {isUploading ? 'Processing...' : 'Click to upload Excel file'}
              </p>
              <p className="text-sm text-gray-500">
                Supports .xlsx and .xls formats
              </p>
            </div>

            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? 'Processing...' : 'Choose File'}
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Processing file...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}

        {/* Success Message */}
        {successCount > 0 && !isUploading && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Successfully imported {successCount} drivers!
            </AlertDescription>
          </Alert>
        )}

        {/* Error Messages */}
        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium">Found {errors.length} error(s):</p>
                <ul className="text-sm space-y-1">
                  {errors.slice(0, 5).map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                  {errors.length > 5 && (
                    <li>• ... and {errors.length - 5} more errors</li>
                  )}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Template Download */}
        <div className="pt-6 border-t border-gray-200">
          <Button
            onClick={downloadTemplate}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Excel Template
          </Button>
          <p className="text-sm text-gray-500 mt-3 text-center">
            Use this template to ensure proper formatting
          </p>
        </div>
    </div>
  );
}
