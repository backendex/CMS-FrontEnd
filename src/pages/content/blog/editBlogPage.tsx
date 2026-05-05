/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { getPostById, updatePost, deletePost } from "@/features/blog/api/blog.api";
import { BlogPost } from "@/features/blog/types/types";
import { BlogForm } from "@/features/blog/components/blogForm";
import { useSite } from "@/features/sites/components/siteContext";

export default function EditBlogPage() {
  const { siteId, id } = useParams<{ siteId: string; id: string }>();
  const { activeSite } = useSite();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        
        // Si no tenemos tableName todavía, esperamos
        if (!tableName) {
          console.warn("Esperando por tableName...");
          return;
        }

        console.log(`Cargando post ${id} para sitio ${siteId} en tabla ${tableName}`);
        const data = await getPostById(id, siteId, tableName);
        console.log("Datos recibidos del servidor:", data);
        
        // Si el backend devuelve un array, tomamos el primer elemento
        const finalData = Array.isArray(data) ? data[0] : data;
        
        if (finalData) {
          setPost(finalData);
        } else {
          console.error("No se encontraron datos para este post.");
          setError("El blog no existe o no se pudo cargar.");
        }
      } catch (err: any) {
        console.error("Error al cargar el blog:", err);
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
      navigate(`/dash/${siteId}/blog`);
    } catch (err) {
      alert("No tienes permisos para editar este post o la sesión expiró.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !siteId || !post) return;
    try {
      const tableName = activeSite?.tableName || post.tableName || "";
      await deletePost(post.id, tableName, siteId);
      navigate(`/dash/${siteId}/blog`);
    } catch (err) {
      alert("No se pudo eliminar el post. Verifica tus permisos.");
    }
  };

  // Build preview URL using the active site's domain
  const previewUrl = post?.postName
    ? activeSite?.domain
      ? `https://${activeSite.domain}/blog/${post.postName}`
      : undefined
    : undefined;

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
    </div>
  );
}
