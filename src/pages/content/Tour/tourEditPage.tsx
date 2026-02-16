/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TourForm } from "@/features/tours/components/tourForm";

export function TourEditPage() {
  const { siteId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const handleUpdate = async (data: any) => {
    if(!siteId) return;
    setLoading(true);
    try {
        navigate(`/dash/${siteId}/tour/edit`)
    } catch (error) {
        console.error("Error al crear:", error)
    }finally{
        setLoading(false);
    }
  };
  return (
    <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Editar Tour</h1>
        <TourForm onSubmit={handleUpdate} isLoading={loading} />
    </div>
  );
}