import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom"; 
import { Loader2, Plus } from "lucide-react"; 
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {getTour} from "@/features/tours/api/tour.api"
import {Tour} from "@/features/tours/types/tourType"
import { useCallback } from "react";
import { ToursTable } from "@/features/tours/components/tourTable";

export default function TourPage() {
  const { siteId } = useParams(); 
  const [loading, setLoading] = useState(true);
  const [tour, setTour] = useState<Tour[]>([]);
  
  const loadTours = useCallback(async () => {
      if (!siteId || siteId === "undefined") return;
      try {
        setLoading(true);
        console.log(`Iniciando petición para el sitio: ${siteId}`);
        
        const response = await getTour(siteId);
        setTour(response);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Error en la carga:", error);
      } finally {
        setLoading(false);
      }
    }, [siteId]);
  
    useEffect(() => {
      loadTours();
    }, [loadTours]);
  
    if (!siteId) return <p>Cargando contexto del sitio...</p>;
  
 return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tours</h1>
          <p className="text-muted-foreground">
            Gestiona la información de las actividades.
          </p>
        </div>
        <Button asChild>
          <Link to={`/dash/${siteId}/tour/new`} className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Tour
          </Link>
        </Button>
      </div>
      <div className="rounded-md border bg-white p-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (                   
           <ToursTable tours ={tour} />
        )}
      </div>
    </div>
  );
}

