import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BlogForm } from '@/features/blog/components/blogForm';
import { createPost } from '@/features/blog/api/blog.api';
import GooglePreview from '@/features/blog/components/googlePreview';

export default function AddBlogPage() {
  const { siteId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Estado para capturar lo que el usuario escribe en el formulario en tiempo real
  const [seoValues, setSeoValues] = useState({
    title: '',
    slug: '',
    description: ''
  });

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
      navigate(`/dash/${siteId}/blog`); 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error al guardar:", error.response?.data?.errors || error.message);
      alert("Error al guardar. Revisa la consola para más detalles.");
    } finally {
      setLoading(false);
    }
  };

  // Esta función se la pasaremos al BlogForm para que nos avise cuando cambien los campos
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormChange = (updatedFields: any) => {
    setSeoValues({
      title: updatedFields.seoData?.seoTitle || '',
      slug: updatedFields.slug || '',
      description: updatedFields.seoData?.metaDescription || ''
    });
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <h1 className="text-3xl font-bold mb-6">Crear nuevo blog</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* COLUMNA IZQUIERDA: Formulario (8 de 12 columnas) */}
        <div className="lg:col-span-7">
          <BlogForm 
            onSubmit={handleCreate} 
            isLoading={loading} 
            onChange={handleFormChange} // Necesitarás añadir este prop a tu BlogForm
          />
        </div>

        {/* COLUMNA DERECHA: Herramientas SEO (5 de 12 columnas) */}
        <div className="lg:col-span-5">
          <div className="sticky top-8 space-y-6">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                Vista previa de búsqueda
              </h2>
              <GooglePreview 
                title={seoValues.title}
                slug={seoValues.slug}
                description={seoValues.description}
                siteDomain="snorkelingadventure.com" 
              />
            </div>
            
            {/* Aquí es donde iría el componente de Análisis SEO que planeamos */}
            <div className="bg-white p-6 rounded-xl border border-slate-200">
               <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                Análisis SEO (Yoast)
              </h2>
              <p className="text-sm text-slate-400 italic">Esperando contenido para analizar...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};