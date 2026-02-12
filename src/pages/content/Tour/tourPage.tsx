import { ToursTable } from "@/features/tours/components/tourTable";
import { Button } from "@/components/ui/button"; 
import { Plus } from "lucide-react"; 
import { useNavigate, useParams } from "react-router-dom";

export default function ToursPage() {
  const { siteId } = useParams(); 
  const navigate = useNavigate();
  const currentSiteId = "f012001e-9cd4-4cc5-b849-a44a701e5869";
 
  return (
    <div className="container mx-auto p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gestión de Tours</h1>         
          <Button 
            onClick={() => navigate(`/dash/${siteId}/tours/new`)} 
            className="bg-black text-white hover:bg-zinc-800"
          >
            <Plus className="mr-2 h-4 w-4" /> Nuevo Tour
          </Button>
        </div>
        <ToursTable siteId={currentSiteId} />
      </div>
    </div>
  );
}

