import { Button } from "@/components/ui/button";
import { Upload, Plus, FileSpreadsheet, UserPlus } from "lucide-react";

interface ActionButtonsProps {
  onOpenUploadModal: () => void;
  onOpenAddDriverModal: () => void;
}

export function ActionButtons({ onOpenUploadModal, onOpenAddDriverModal }: ActionButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-6">
      <Button
        onClick={onOpenUploadModal}
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 text-base font-semibold"
      >
        <FileSpreadsheet className="h-5 w-5 mr-2" />
        Upload Trips Data
      </Button>
      
      <Button
        onClick={onOpenAddDriverModal}
        className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 text-base font-semibold"
      >
        <UserPlus className="h-5 w-5 mr-2" />
        Add Trip Data Individually
      </Button>
    </div>
  );
}
