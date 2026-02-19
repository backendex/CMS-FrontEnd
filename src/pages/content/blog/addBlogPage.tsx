import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BlogForm } from "@/features/blog/components/blogForm"; // Ajusta la ruta según tu carpeta
import { createPost } from "@/features/blog/api/blog.api"; // Tu función de axios/fetch
import { BlogPost } from "@/features/blog/types/types";

const AddBlogPage: React.FC = () => {
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

      // 2. Llamada a la API
      await createPost(payload);

      // 3. Si todo sale bien, avisamos y redirigimos
      alert("¡Blog creado con éxito!");
      navigate(`/dash/${siteId}/blog`); 
      
    } catch (error: any) {
      // Aquí atrapamos los errores 400 que vimos en tu consola
      console.error("Error completo del servidor:", error.response?.data);
      
      const serverErrors = error.response?.data?.errors;
      if (serverErrors) {
        // Mostramos un mensaje amigable con los campos que faltan
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
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        Crear Nuevo blog
      </h1>

      {/* Pasamos onSubmit y el estado de carga al formulario */}
      <BlogForm 
        onSubmit={handleCreate} 
        isSubmitting={loading} 
      />
    </div>
  );
};

export default AddBlogPage;