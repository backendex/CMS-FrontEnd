import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TourForm } from "@/features/tours/components/tourForm";

export default function AddTourPage() {
  const { siteId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const handleCreate = async (data: any) => {
    if (!siteId) return;
    setLoading(true);
    try {
      navigate(`/dash/${siteId}/tours`);
    } catch (error) {
      console.error("Error al crear:", error);
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