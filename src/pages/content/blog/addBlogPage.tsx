/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BlogForm } from "@/features/blog/components/blogForm"; // Ajusta la ruta según tu carpeta
import { createPost } from "@/features/blog/api/blog.api"; // Tu función de axios/fetch
import { BlogPost } from "@/features/blog/types/types";

export default function AddBlogPage() {
  const { siteId } = useParams<{ siteId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data: BlogPost) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        siteId: siteId || data.siteId, 
      };

      console.log("Enviando a Postgres:", payload);
      await createPost(payload);
      alert("¡Blog creado con éxito!");
      navigate(`/dash/${siteId}/blog`); 
      
    } catch (error: any) {
      console.error("Error completo del servidor:", error.response?.data);
      
      const serverErrors = error.response?.data?.errors;
      if (serverErrors) {
        const missingFields = Object.keys(serverErrors).join(", ");
        alert(`Error: Faltan campos obligatorios (${missingFields})`);
      } else {
        alert("Ocurrió un error al conectar con el servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-3xl"> 
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Crear nuevo blog</h1>
        <div className="rounded-md border bg-white p-4 shadow-sm">
          <BlogForm onSubmit={handleCreate} isLoading={loading} />
        </div>
      </div>
    </div>
  );
};

