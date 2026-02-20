import React, { useState } from "react";
import { useYoastAnalysis } from "@/features/blog/hooks/useYoastAnalyst"; 
import { BlogPost, BlogFormProps } from "@/features/blog/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import GooglePreview from "@/features/blog/components/googlePreview"; 

export const BlogForm: React.FC<BlogFormProps> = ({ initialData, onSubmit, isSubmitting }) => {
  const [post, setPost] = useState<BlogPost>(initialData || {
    title: '', slug: '', content: '', siteId: '', featuredImage: '',
    seoData: { seoTitle: '', metaDescription: '', focusKeyword: '', ogTitle: '', ogDescription: '', ogImage: '', canonicalUrl: '', robotsContent: 'index, follow' }
  });

  const seoScore = useYoastAnalysis(post.content, post.title, post.seoData);

  const handleSeoChange = (field: string, value: string) => {
    setPost({ ...post, seoData: { ...post.seoData, [field]: value } });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const autoSlug = post.slug || post.title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    onSubmit({ ...post, slug: autoSlug });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-6 max-w-5xl mx-auto">
      
      {/* SECCIÓN DEL EDITOR PRINCIPAL */}
      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="p-0 space-y-4">
          <Input 
            className="text-4xl font-bold h-auto py-4 border-none shadow-none focus-visible:ring-0 placeholder:opacity-50"
            placeholder="Añadir el título"
            value={post.title}
            onChange={(e) => setPost({...post, title: e.target.value})}
          />
          
          <div className="text-sm text-muted-foreground px-3">
            <strong>Enlace permanente:</strong> {post.slug || 'autogenerado'}
          </div>

          <Textarea 
            className="min-h-[400px] text-lg leading-relaxed border-none shadow-none focus-visible:ring-0 resize-none"
            placeholder="Empieza a escribir o teclea / para elegir un bloque"
            value={post.content}
            onChange={(e) => setPost({...post, content: e.target.value})}
          />
        </CardContent>
      </Card>

      {/* SECCIÓN YOAST SEO ESTILO SHADCN */}
      <Card className="border shadow-sm">
        <CardHeader className="bg-muted/50 border-bottom py-3">
          <CardTitle className="text-sm font-medium">Yoast SEO</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="seo" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-auto p-0">
              <TabsTrigger value="seo" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3">SEO</TabsTrigger>
              <TabsTrigger value="social" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3">Social</TabsTrigger>
            </TabsList>

            <TabsContent value="seo" className="p-6 space-y-6">
              {/* Vista Previa */}
              <div className="space-y-3">
                <Label className="text-base">Vista previa de Google</Label>
                <GooglePreview 
                  title={post.seoData.seoTitle || post.title} 
                  slug={post.slug} 
                  description={post.seoData.metaDescription} 
                  siteDomain="tusitio.com" 
                />
              </div>

              {/* Campos SEO */}
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="keyword">Frase clave objetivo</Label>
                  <Input 
                    id="keyword"
                    value={post.seoData.focusKeyword}
                    onChange={(e) => handleSeoChange('focusKeyword', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seoTitle">Título SEO</Label>
                  <Input 
                    id="seoTitle"
                    value={post.seoData.seoTitle}
                    onChange={(e) => handleSeoChange('seoTitle', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta">Metadescripción</Label>
                  <Textarea 
                    id="meta"
                    value={post.seoData.metaDescription}
                    onChange={(e) => handleSeoChange('metaDescription', e.target.value)}
                  />
                </div>
              </div>

              {/* Semáforo de Análisis */}
              <div className="pt-4 border-t flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: seoScore.color }} 
                />
                <span className="text-sm font-medium">
                  Análisis SEO: {seoScore.message} ({seoScore.points}/100)
                </span>
              </div>
            </TabsContent>

            <TabsContent value="social" className="p-6">
              <div className="space-y-4">
                <Label>Imagen para redes sociales</Label>
                <Input 
                  placeholder="URL de la imagen (Open Graph)"
                  value={post.featuredImage}
                  onChange={(e) => setPost({...post, featuredImage: e.target.value})}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <div className="flex justify-end pt-4">
        <Button 
          type="submit" 
          size="lg" 
          disabled={isSubmitting}
          className="px-10"
        >
          {isSubmitting ? 'Guardando...' : 'Publicar'}
        </Button>
      </div>
    </form>
  );
};