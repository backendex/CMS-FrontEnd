import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TourForm } from "@/features/tours/components/tourForm";
import { getTourById, updateTour } from "@/features/tours/api/tour.api";
import { Loader2 } from "lucide-react";
import { StatusModal, StatusType } from "@/components/ui/status-modal";

export default function EditTourPage() {
  const { siteId, id } = useParams(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [tourData, setTourData] = useState(null);

  // Modal State
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: StatusType;
    title: string;
    description?: string;
  }>({
    isOpen: false,
    type: "success",
    title: "",
  });

  const closeModal = () => setModal(prev => ({ ...prev, isOpen: false }));

  useEffect(() => {
    const loadTour = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getTourById(id);
        setTourData(data);
      } catch (error) {
        setModal({
          isOpen: true,
          type: "error",
          title: "Error de carga",
          description: "No se pudo cargar la información del tour."
        });
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
      
      setModal({
        isOpen: true,
        type: "success",
        title: "¡Actualizado!",
        description: "Los cambios del tour se han guardado con éxito."
      });
      
    } catch (error: any) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Error al actualizar",
        description: error.response?.data?.message || "Ocurrió un error inesperado."
      });
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

      <StatusModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        type={modal.type}
        title={modal.title}
        description={modal.description}
        onAction={() => {
          closeModal();
          if (modal.type === "success") {
            navigate(`/dash/${siteId}/tour`);
          }
        }}
      />
    </div>
  );
}