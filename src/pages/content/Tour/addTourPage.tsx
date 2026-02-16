import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TourForm } from "@/features/tours/components/tourForm";
import { createTour } from "@/features/tours/api/tour.api";

export default function AddTourPage() {
  const { siteId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const handleCreate = async (data: any) => {
  if (!siteId) return;
  setLoading(true);
  try {
    const payload = {
      ...data,
      siteId: siteId, // El GUID que tu controlador exige
      category: "General", // Agrega este campo si tu DTO lo pide como obligatorio
    };

    await createTour(payload);
    alert("¡Tour añadido exitosamente!");
    navigate(`/dash/${siteId}/tours`); // Cambia a la ruta de la lista
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error de validación:", error.response?.data?.errors);
    alert("Error de validación. Revisa los campos obligatorios.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Crear Nuevo Tour</h1>
      <TourForm onSubmit={handleCreate} isLoading={loading} />
    </div>
  );
}