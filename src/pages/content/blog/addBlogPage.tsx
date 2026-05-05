/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BlogForm } from "@/features/blog/components/blogForm";
import { createPost } from "@/features/blog/api/blog.api";
import { BlogPost } from "@/features/blog/types/types";
import { useSite } from "@/features/sites/components/siteContext";

export default function AddBlogPage() {
  const { siteId } = useParams<{ siteId: string }>();
  const { activeSite } = useSite();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  /** Obtiene el tableName con todos los fallbacks posibles */
  const getTableName = (): string => {
    if (activeSite?.tableName) return activeSite.tableName;
    // Parche temporal por nombre de sitio
    if (activeSite?.name === "Snorkeling Adventure") return "snorkell";
    if (activeSite?.name === "Cenote Adventuring") return "cenote";
    return "";
  };

  const handleCreate = async (data: BlogPost) => {
    const tableName = getTableName();

    // Validar antes de llamar al API
    if (!tableName) {
      alert(
        "No se puede determinar el sitio activo. Recarga la página y vuelve a intentarlo.\n\n" +
        `Sitio activo: ${activeSite?.name || "ninguno"}`
      );
      return;
    }

    if (!siteId) {
      alert("Error: No se encontró el ID del sitio en la URL.");
      return;
    }

    setLoading(true);
    try {
      const payload: BlogPost = {
        ...data,
        siteId: siteId || data.siteId,
        tableName: tableName,  // Siempre aseguramos que tableName esté presente
      };

      console.log("Payload enviado al backend:", {
        tableName: payload.tableName,
        siteId: payload.siteId,
        postTitle: payload.postTitle,
        postStatus: payload.postStatus,
      });

      await createPost(payload, tableName);
      alert("¡Blog creado con éxito!");
      navigate(`/dash/${siteId}/blog`);

    } catch (error: any) {
      console.error("Error completo del servidor:", error.response?.data);

      const serverErrors = error.response?.data?.errors;
      if (serverErrors) {
        const details = Object.entries(serverErrors)
          .map(([field, messages]) => `  • ${field}: ${(messages as string[]).join(", ")}`)
          .join("\n");
        alert(`Error de validación del servidor:\n${details}`);
      } else if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("Ocurrió un error al conectar con el servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-background overflow-hidden">
      <BlogForm onSubmit={handleCreate} isLoading={loading} />
    </div>
  );
}
