import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TourForm } from "./tourForm";
import { getTourById, updateTour } from "../api/tour.api";
import { Loader2 } from "lucide-react";
import { StatusModal, StatusType } from "@/components/ui/status-modal";

export const EditTourForm = () => {
  const { siteId, id } = useParams<{ siteId: string; id: string }>(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [tourData, setTourData] = useState(null);

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
        const data = await getTourById(id, siteId ?? "");
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
        description: "Los cambios se han guardado con éxito."
      });
    } catch (error: any) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Error al actualizar",
        description: "Ocurrió un error."
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
