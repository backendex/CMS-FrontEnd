import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TourForm } from "./tourForm";
import { createTour } from "../api/tour.api";
import { StatusModal, StatusType } from "@/components/ui/status-modal";

export const AddTourForm = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
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

  const handleCreate = async (data: any) => {
    if (!siteId) return;
    setLoading(true);
    try {
      await createTour({ ...data, siteId });
      setModal({
        isOpen: true,
        type: "success",
        title: "¡Tour creado!",
        description: "El nuevo tour se ha guardado exitosamente."
      });
    } catch (error: any) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Error al crear",
        description: "No se pudo guardar el tour."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Crear Nuevo Tour</h1>
      <TourForm onSubmit={handleCreate} siteId={siteId} />
      
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
