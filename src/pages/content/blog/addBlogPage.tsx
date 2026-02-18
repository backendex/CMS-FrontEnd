import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BlogForm } from '@/features/blog/components/blogForm';
import { createPost } from '@/features/blog/api/blog.api';
import GooglePreview from '@/features/blog/components/googlePreview';
import { BlogPost } from '@/features/blog/types/types';

export default function AddBlogPage() {
  const { siteId } = useParams<{ siteId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

 const handleCreate = async (data: any) => {
   if (!siteId) return;
   setLoading(true);
   try {
     const payload = {
       ...data,
       siteId: siteId, 
       category: "General", 
     };
 
     await createPost(payload);
     alert("¡Tour añadido exitosamente!");
     navigate(`/dash/${siteId}/blog`); 
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   } catch (error: any) {
     console.error("Error de validación:", error.response?.data?.errors);
     alert("Error de validación. Revisa los campos obligatorios.");
   } finally {
     setLoading(false);
   }
 };
 
 if (!siteId || siteId === "undefined") {
    return <p className="p-10">Cargando contexto del sitio...</p>;
  }

  return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Crear Nuevo blog</h1>
        <BlogForm onSubmit={handleCreate} isLoading={loading} />
      </div>
    );
}