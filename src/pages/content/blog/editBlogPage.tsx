import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { getPostById, updatePost, deletePost } from "@/features/blog/api/blog.api";
import { BlogPost } from "@/features/blog/types/types";
import { BlogForm } from "@/features/blog/components/blogForm";
import { useSite } from "@/features/sites/components/siteContext";
import { StatusModal, StatusType } from "@/components/ui/status-modal";

export default function EditBlogPage() {
  const { siteId, id } = useParams<{ siteId: string; id: string }>();
  const { activeSite } = useSite();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const getTableName = (): string => {
    if (activeSite?.tableName) return activeSite.tableName;
    if (activeSite?.name === "Snorkeling Adventure") return "snorkell";
    if (activeSite?.name === "Cenote Adventuring") return "cenote";
    return post?.tableName || "";
  };

  useEffect(() => {
    const loadPost = async () => {
      if (!id || !siteId) return;
      try {
        setLoading(true);
        const tableName = getTableName();
        if (!tableName) return;

        const data = await getPostById(id, siteId, tableName);
        const finalData = Array.isArray(data) ? data[0] : data;
        
        if (finalData) {
          console.log("✅ Post cargado:", { id: finalData.id, postName: finalData.postName, postStatus: finalData.postStatus, tableName: finalData.tableName });
          setPost(finalData);
        } else {
          setError("El blog no existe o no se pudo cargar.");
        }
      } catch (err: any) {
        setError("Error al cargar el blog. Verifica tus permisos.");
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [id, siteId, activeSite]);

  const handleUpdate = async (updatedData: BlogPost) => {
    if (!id || !siteId) return;
    setIsSaving(true);
    try {
      const tableName = getTableName();
      const numericId = Number(id);
      const payload: BlogPost = { 
        ...updatedData, 
        id: numericId, 
        siteId,
        tableName: tableName 
      };
      await updatePost(id, payload);
      
      setModal({
        isOpen: true,
        type: "success",
        title: "¡Guardado!",
        description: "Tus cambios se han actualizado correctamente."
      });
      
    } catch (err) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Error al actualizar",
        description: "No tienes permisos o la sesión ha expirado."
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !siteId || !post) return;

    setModal({
      isOpen: true,
      type: "warning",
      title: "¿Eliminar blog?",
      description: "Esta entrada se borrará permanentemente. Esta acción no se puede deshacer.",
      // @ts-ignore - onAction is supported but type might be strict
      onAction: async () => {
        try {
          const tableName = getTableName();
          if (!tableName) throw new Error("No se pudo determinar la tabla.");

          await deletePost(post.id, tableName, siteId);
          
          setModal({
            isOpen: true,
            type: "success",
            title: "¡Eliminado!",
            description: "La entrada ha sido eliminada correctamente."
          });
        } catch (err) {
          console.error("Error al eliminar:", err);
          setModal({
            isOpen: true,
            type: "error",
            title: "Error al eliminar",
            description: "No se pudo eliminar el post. Verifica tus permisos."
          });
        }
      }
    });
  };

  const astroBase = activeSite?.domain
    ? `https://${activeSite.domain}`
    : `http://localhost:4321`;

  // postName puede venir vacío del backend — lo generamos igual que el formulario
  const effectiveSlug = post?.postName ||
    post?.postTitle?.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

  const previewUrl = effectiveSlug
    ? `${astroBase}/blog/${effectiveSlug}?preview=true`
    : undefined;

  console.log("🔍 previewUrl:", previewUrl, "| postName:", post?.postName, "| effectiveSlug:", effectiveSlug);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;
  if (error) return <div className="p-10 text-destructive">{error}</div>;

  return (
    <div className="h-full bg-background overflow-hidden">
      <BlogForm
        onSubmit={handleUpdate}
        isLoading={isSaving}
        initialData={post}
        onDelete={handleDelete}
        previewUrl={previewUrl}
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
            navigate(`/dash/${siteId}/blog`);
          }
        }}
      />
    </div>
  );
}
