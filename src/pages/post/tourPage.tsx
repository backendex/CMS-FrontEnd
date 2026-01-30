import { useState } from "react";
import { ToursTable } from "@/features/tours/components/tourTable";
import { TourForm } from "@/features/tours/components/tourForm";

export default function ToursPage() {
  // Un estado simple para decidir qué ver (luego será con rutas)
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="container mx-auto">
      {isEditing ? (
        // Si estamos editando, mostramos el formulario
        <TourForm onCancel={() => setIsEditing(false)} />
      ) : (
        // Si no, mostramos la tabla con la lista
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Gestión de Tours</h1>
          </div>
          <ToursTable onEdit={() => setIsEditing(true)} />
        </div>
      )}
    </div>
  );
}