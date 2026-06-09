import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getBlogs, deletePost } from '../api/blog.api';
import { BlogPost } from '../types/types';
import { Button } from '@/components/ui/button';
import { Loader2, Plus } from 'lucide-react';
import { BlogsTable } from './blogTable';
import { useSite } from '@/features/sites/components/siteContext';
import { StatusModal, StatusType } from "@/components/ui/status-modal";

export const BlogList = () => {
  const { siteId } = useParams<{ siteId: string }>(); 
  const { activeSite } = useSite();
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
    if (activeSite?.tableName) return activeSite.tableName;
    const name = activeSite?.name?.toLowerCase() || "";
    if (name.includes("snorkeling")) return "snorkell";
    if (name.includes("cenote")) return "cenote";
    if (name.includes("extreme")) return "extreme";
    return "";
  };

  const loadBlogs = useCallback(async () => {
    if (!siteId || siteId === "undefined") return;
    if (activeSite && String(activeSite.id) !== String(siteId)) return;

    try {
      setLoading(true);
      const tableName = getTableName();
      if (!tableName) return;

      const response = await getBlogs(siteId, tableName);
      setBlogs(response);
    } catch (error: any) {
      console.error("Error cargando blogs:", error);
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
      title: "Delete post?",
      description: "This action cannot be undone. The post will be permanently deleted from the database.",
      onAction: async () => {
        try {
          const tableName = getTableName();
          await deletePost(id, tableName, siteId);
          setBlogs(prev => prev.filter(b => b.id !== id));
          setModal({
            isOpen: true,
            type: "success",
            title: "Deleted!",
            description: "The post has been successfully deleted from this site."
          });
        } catch (error: any) {
          console.error("Error deleting post:", error);
          setModal({
            isOpen: true,
            type: "error",
            title: "Error",
            description: "Could not delete the post."
          });
        }
      }
    });
  };

  if (!siteId) return <p>Loading site context...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blog</h1>
          <p className="text-muted-foreground">
            Manage blog information.
          </p>
        </div>
        <Button asChild>
          <Link to={`/dash/${siteId}/blog/new`} className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            New blog
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
