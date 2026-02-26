/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams} from "react-router-dom";
import {Loader2,} from "lucide-react";
import { getPostById, updatePost } from "@/features/blog/api/blog.api";
import { BlogPost } from "@/features/blog/types/types";
import { BlogForm } from "@/features/blog/components/blogForm";

export default function EditBlogPage() {
  const { siteId, id } = useParams<{ siteId: string; id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null); 
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      if (!id || !siteId) return;
      try {
        setLoading(true);
        const data = await getPostById(id, siteId);
        setPost(data);
      } catch (err: any) {
        setError("Error al cargar el blog. Verifica tus permisos.");
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [id, siteId]);

  const handleUpdate = async (updatedData: BlogPost) => {
    if (!id || !siteId) return;
    setIsSaving(true);
    try {
      const payload = { ...updatedData, id, siteId };
      await updatePost(id, payload);
      navigate(`/dash/${siteId}/blog`);
    } catch (err) {
      alert("No tienes permisos para editar este post o la sesión expiró.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-8">
      <div className="max-w-3xl"> 
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Editar Blog</h1>
        <div className="rounded-md border bg-white p-4 shadow-sm">
          <BlogForm 
            onSubmit={handleUpdate} 
            isLoading={isSaving} 
            initialData={post} 
          />
        </div>
      </div>
    </div>
  );
}

