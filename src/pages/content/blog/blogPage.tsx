import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { getBlogs, deletePost } from '@/features/blog/api/blog.api';
import { BlogPost } from '@/features/blog/types/types';
import { Button } from '@/components/ui/button';
import { Loader2, Plus } from 'lucide-react';
import { BlogsTable } from '@/features/blog/components/blogTable';
import { useSite } from '@/features/sites/components/siteContext';
import { StatusModal, StatusType } from "@/components/ui/status-modal";

export function BlogPage() {
  const { siteId } = useParams<{ siteId: string }>(); 
  const { activeSite } = useSite();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  // Modal State
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: StatusType;
    title: string;
    description?: string;
    onAction?: () => void;
  }>({
    isOpen: false,
    type: "success",
    title: "",
  });

  const closeModal = () => setModal(prev => ({ ...prev, isOpen: false }));

  const getTableName = () => {
    let tableName = activeSite?.tableName || "";
    if (!tableName && activeSite?.name === "Snorkeling Adventure") {
      tableName = "snorkell";
    }
    if (!tableName && activeSite?.name === "Cenote Adventuring") {
      tableName = "cenote";
    }
    return tableName;
  };

  const loadBlogs = useCallback(async () => {
    if (!siteId || siteId === "undefined") return;
    try {
      setLoading(true);
      const tableName = getTableName();
      const response = await getBlogs(siteId, tableName);
      setBlogs(response);
    } catch (error: any) {
      console.error("Error en la carga:", error);
    } finally {
      setLoading(false);
    }
  }, [siteId, activeSite]);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  const handleDelete = async (id: number) => {
    if (!siteId) return;
    
    setModal({
      isOpen: true,
      type: "warning",
      title: "¿Eliminar entrada?",
      description: "Esta acción no se puede deshacer. La entrada se borrará permanentemente.",
      onAction: async () => {
        try {
          const tableName = getTableName();
          await deletePost(id, tableName, siteId);
          setBlogs(prev => prev.filter(b => b.id !== id));
          setModal({
            isOpen: true,
            type: "success",
            title: "Eliminado",
            description: "La entrada ha sido eliminada correctamente."
          });
        } catch (error: any) {
          setModal({
            isOpen: true,
            type: "error",
            title: "Error",
            description: "No se pudo eliminar el post."
          });
        }
      }
    });
  };

  if (!siteId) return <p>Cargando contexto del sitio...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blog</h1>
          <p className="text-muted-foreground">
            Gestiona la información del blog.
          </p>
        </div>
        <Button asChild>
          <Link to={`/dash/${siteId}/blog/new`} className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo blog
          </Link>
        </Button>
      </div>
      <div className="rounded-md border bg-white p-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (                   
           <BlogsTable blogs={blogs} siteId={siteId} onDelete={handleDelete} />
        )}
      </div>

      <StatusModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        type={modal.type}
        title={modal.title}
        description={modal.description}
        onAction={modal.onAction}
      />
    </div>
  );       
}