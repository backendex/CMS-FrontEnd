import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TourForm } from "@/features/tours/components/tourForm";
import { createTour } from "@/features/tours/api/tour.api";
import { StatusModal, StatusType } from "@/components/ui/status-modal";

export default function AddTourPage() {
  const { siteId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const handleCreate = async (data: any) => {
    if (!siteId) return;
    setLoading(true);
    try {
      const payload = {
        ...data,
        siteId: siteId, 
        category: "General", 
      };

      await createTour(payload);
      
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
        title: "Error de validación",
        description: "Revisa los campos obligatorios y vuelve a intentarlo."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Crear Nuevo Tour</h1>
      <TourForm onSubmit={handleCreate} isLoading={loading} />
      
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