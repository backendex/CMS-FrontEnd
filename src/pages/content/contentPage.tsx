import { ContentManager } from "@/features/content/components/ContentManager";
import { useParams } from "react-router-dom";

export default function ContentPage() {
  // Obtenemos el ID de la URL (1 para Extreme, 2 para WhatToDo, etc.)
  const { siteId } = useParams();

  return (
    <div className="container mx-auto pb-10">
      {/* Pasamos el siteId al Manager para que, en el futuro, 
        el componente sepa qué textos de qué sitio traer desde C# 
      */}
      <ContentManager siteId={siteId} />
    </div>
  );
}