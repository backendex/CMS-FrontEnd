import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TourForm } from "@/features/tours/components/tourForm";
import { getTourById, updateTour } from "@/features/tours/api/tour.api";
import { Loader2 } from "lucide-react";

export default function EditTourPage() {
  const { siteId, id } = useParams(); // 'id' es el UUID del tour
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [tourData, setTourData] = useState(null);

  useEffect(() => {
    const loadTour = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getTourById(id);
        setTourData(data);
      } catch (error) {
        console.error("Error al cargar el tour:", error);
        alert("No se pudo cargar la información del tour.");
      } finally {
        setLoading(false);
      }
    };
    loadTour();
  }, [id]);

  const handleUpdate = async (data: any) => {
    if (!id || !siteId) return;
    setUpdating(true);
    try {
      await updateTour(id, { ...data, siteId });
      alert("¡Tour actualizado exitosamente!");
      navigate(`/dash/${siteId}/tours`);
    } catch (error: any) {
      console.error("Error al actualizar:", error);
      alert("Error al actualizar: " + (error.response?.data?.message || "Error desconocido"));
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Editar Tour</h1>
      <TourForm 
        onSubmit={handleUpdate} 
        initialData={tourData} 
        siteId={siteId} 
        isLoading={updating} 
      />
    </div>
  );
}