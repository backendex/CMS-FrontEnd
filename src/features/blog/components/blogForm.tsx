import React, { useState } from "react";
import { useYoastAnalysis } from "@/features/blog/hooks/useYoastAnalyst"; 
import { BlogPost, BlogFormProps } from "@/features/blog/types/types";
import { Button } from "@/components/ui/button";
import GooglePreview from "@/features/blog/components/googlePreview"; 

const defaultPost: BlogPost = {
  title: '',
  slug: '',
  content: '',
  siteId: '', 
  featuredImage: '', 
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
  const seoScore = useYoastAnalysis(post.content, post.title, post.seoData);

  const handleSeoChange = (field: string, value: string) => {
    setPost({
      ...post,
      seoData: { ...post.seoData, [field]: value }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const autoSlug = post.slug || post.title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    const imgUrl = post.featuredImage || 'https://via.placeholder.com/800';

    const finalPost = {
      ...post,
      slug: autoSlug,
      featuredImage: imgUrl,
      seoData: {
        ...post.seoData,
        ogTitle: post.seoData.ogTitle || post.title,
        ogDescription: post.seoData.ogDescription || post.seoData.metaDescription,
        ogImage: post.seoData.ogImage || imgUrl,
        canonicalUrl: post.seoData.canonicalUrl || `https://tusitio.com/blog/${autoSlug}`
      }
    };
    onSubmit(finalPost);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '40px', padding: '20px' }}>
      
      {/* SECCIÓN IZQUIERDA: Editor */}
      <div style={{ flex: 2 }}>
        <input 
          style={{ width: '100%', fontSize: '2rem', marginBottom: '20px' }}
          placeholder="Título del Post"
          value={post.title}
          onChange={(e) => setPost({...post, title: e.target.value})}
        />
        
        <div style={{ marginBottom: '20px', fontSize: '0.9rem', color: '#666' }}>
          <strong>Slug:</strong> {post.slug || 'se generará del título'}
        </div>

        <textarea 
          style={{ width: '100%', minHeight: '400px' }}
          placeholder="Escribe aquí la historia de tu tour..."
          value={post.content}
          onChange={(e) => setPost({...post, content: e.target.value})}
        />
      </div>

      {/* SECCIÓN DERECHA: Sidebar */}
      <aside style={{ flex: 1, background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '15px' }}>Análisis SEO</h3>
        
        <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '10px', 
            background: '#fff', 
            borderRadius: '5px',
            border: `1px solid ${seoScore.color}`,
            marginBottom: '20px'
        }}>
          <div style={{ 
            width: 15, height: 15, borderRadius: '50%', 
            backgroundColor: seoScore.color, marginRight: 10 
          }} />
          <strong>{seoScore.message} ({seoScore.points}/100)</strong>
        </div>

        {/* 2. AQUÍ APARECE EL PREVIEW (Justo debajo del semáforo) */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', fontSize: '14px' }}>
            Vista previa en Google:
          </label>
          <GooglePreview 
            title={post.seoData.seoTitle || post.title} 
            slug={post.slug} 
            description={post.seoData.metaDescription} 
            siteDomain="tusitio.com" 
          />
        </div>

        <div style={{ marginTop: '20px' }}>
          <label>URL Imagen Destacada</label>
          <input 
            style={{ width: '100%', marginBottom: '15px' }}
            placeholder="https://link-de-tu-imagen.jpg"
            value={post.featuredImage}
            onChange={(e) => setPost({...post, featuredImage: e.target.value})}
          />

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

        <Button 
          type="submit"
          disabled={isSubmitting}
          style={{ width: '100%', marginTop: '20px', padding: '10px'}}
        >
          {isSubmitting ? 'Guardando...' : 'Guardar blog'}
        </Button>
      </aside>
    </form>
  );
};