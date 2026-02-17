import React, { useState } from "react";
import { useYoastAnalysis } from "@/features/blog/hooks/useYoastAnalyst"; // Verifica que el nombre del archivo sea exacto
import { BlogPost } from "../types/types";
import {BlogFormProps} from "@/features/blog/types/types"

const defaultPost: BlogPost = {
  title: '',
  slug: '',
  content: '',
  siteId: 'extreme-adventure', // Valor inicial
  seoData: {
    seoTitle: '',
    metaDescription: '',
    focusKeyword: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    canonicalUrl: '',
    robotsContent: 'index, follow'
  }
};

export const BlogForm: React.FC<BlogFormProps> = ({ initialData, onSubmit, isSubmitting }) => {
  const [post, setPost] = useState<BlogPost>(initialData || defaultPost);
  
  // Tu hook de inteligencia SEO
  const seoScore = useYoastAnalysis(post.content, post.title, post.seoData);

  // Función para actualizar campos anidados (como seoData)
  const handleSeoChange = (field: string, value: string) => {
    setPost({
      ...post,
      seoData: { ...post.seoData, [field]: value }
    });
  };

  return (
    <div style={{ display: 'flex', gap: '40px', padding: '20px' }}>
      
      {/* SECCIÓN IZQUIERDA: Editor de Contenido */}
      <div style={{ flex: 2 }}>
        <input 
          style={{ width: '100%', fontSize: '2rem', marginBottom: '20px' }}
          placeholder="Título del Post"
          value={post.title}
          onChange={(e) => setPost({...post, title: e.target.value})}
        />
        
        <textarea 
          style={{ width: '100%', minHeight: '400px' }}
          placeholder="Escribe aquí la historia de tu tour..."
          value={post.content}
          onChange={(e) => setPost({...post, content: e.target.value})}
        />
      </div>

      {/* SECCIÓN DERECHA: Sidebar de Yoast SEO */}
      <aside style={{ flex: 1, background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
        <h3>Análisis SEO</h3>
        
        {/* Semáforo Visual */}
        <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '10px', 
            background: '#fff', 
            borderRadius: '5px',
            border: `1px solid ${seoScore.color}` 
        }}>
          <div style={{ 
            width: 15, height: 15, borderRadius: '50%', 
            backgroundColor: seoScore.color, marginRight: 10 
          }} />
          <strong>{seoScore.message} ({seoScore.points}/100)</strong>
        </div>

        <div style={{ marginTop: '20px' }}>
          <label>Palabra Clave (Focus Keyword)</label>
          <input 
            style={{ width: '100%', marginBottom: '15px' }}
            value={post.seoData.focusKeyword}
            onChange={(e) => handleSeoChange('focusKeyword', e.target.value)}
          />

          <label>SEO Title (Google)</label>
          <input 
            style={{ width: '100%', marginBottom: '15px' }}
            value={post.seoData.seoTitle}
            onChange={(e) => handleSeoChange('seoTitle', e.target.value)}
          />

          <label>Meta Description</label>
          <textarea 
            style={{ width: '100%', height: '80px' }}
            value={post.seoData.metaDescription}
            onChange={(e) => handleSeoChange('metaDescription', e.target.value)}
          />
        </div>

        <button 
          onClick={() => onSubmit(post)}
          disabled={isSubmitting}
          style={{ width: '100%', marginTop: '20px', padding: '10px', background: '#007bff', color: '#fff' }}
        >
          {isSubmitting ? 'Guardando...' : 'Guardar en Postgres'}
        </button>
      </aside>
    </div>
  );
};