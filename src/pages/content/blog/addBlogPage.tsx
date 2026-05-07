import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BlogForm } from "@/features/blog/components/blogForm";
import { createPost } from "@/features/blog/api/blog.api";
import { BlogPost } from "@/features/blog/types/types";
import { useSite } from "@/features/sites/components/siteContext";
import { StatusModal, StatusType } from "@/components/ui/status-modal";

export default function AddBlogPage() {
  const { siteId } = useParams<{ siteId: string }>();
  const { activeSite } = useSite();
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

    if (!tableName) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Error de configuración",
        description: "No se puede determinar el sitio activo. Recarga la página."
      });
      return;
    }

    setLoading(true);
    try {
      const payload: BlogPost = {
        ...data,
        siteId: siteId || "",
        tableName: tableName,
      };

      await createPost(payload, tableName);
      
      setModal({
        isOpen: true,
        type: "success",
        title: "¡Publicado!",
        description: "Tu nueva entrada ha sido creada con éxito y ya está disponible."
      });

    } catch (error: any) {
      const serverErrors = error.response?.data?.errors;
      let description = "Ocurrió un error al conectar con el servidor.";
      
      if (serverErrors) {
        description = Object.entries(serverErrors)
          .map(([field, messages]) => `${field}: ${(messages as string[]).join(", ")}`)
          .join("\n");
      } else if (error.response?.data?.message) {
        description = error.response.data.message;
      }

      setModal({
        isOpen: true,
        type: "error",
        title: "Error al guardar",
        description
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-background overflow-hidden">
      <BlogForm onSubmit={handleCreate} isLoading={loading} />
      
      <StatusModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        type={modal.type}
        title={modal.title}
        description={modal.description}
        onAction={() => {
          closeModal();
          if (modal.type === "success") {
            navigate(`/dash/${siteId}/blog`);
          }
        }}
      />
    </div>
  );
}
