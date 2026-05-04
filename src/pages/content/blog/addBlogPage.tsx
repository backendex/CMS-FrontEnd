/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BlogForm } from "@/features/blog/components/blogForm"; 
import { createPost } from "@/features/blog/api/blog.api"; 
import { BlogPost } from "@/features/blog/types/types";
import { useSite } from "@/features/sites/components/siteContext"; // Importamos useSite

export default function AddBlogPage() {
  const { siteId } = useParams<{ siteId: string }>();
  const { activeSite } = useSite(); // Obtenemos el contexto del sitio
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data: BlogPost) => {
    setLoading(true);
    try {
      // Determinamos el nombre de la tabla (con el parche temporal)
      let tableName = activeSite?.tableName || "";
      if (!tableName && activeSite?.name === "Snorkeling Adventure") {
        tableName = "snorkell";
      }

      const payload = {
        ...data,
        siteId: siteId || data.siteId, 
        tableName: tableName,             
      };

      console.log("Payload final (sin siteName):", payload);
      await createPost(payload, tableName); 
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

