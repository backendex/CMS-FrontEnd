import React, { useState, useEffect } from "react";
import { useYoastAnalysis } from "@/features/blog/hooks/useYoastAnalyst";
import { BlogPost, BlogFormProps } from "@/features/blog/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronRight, 
  ChevronDown, 
  Settings2, 
  Eye, 
  Globe, 
  Calendar, 
  User, 
  Image as ImageIcon,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Link2
} from "lucide-react";
import GooglePreview from "@/features/blog/components/googlePreview";

export const BlogForm: React.FC<BlogFormProps & { isLoading?: boolean }> = ({
  initialData,
  onSubmit,
  isSubmitting,
  isLoading, // Handle both names for compatibility
}) => {
  const loading = isSubmitting || isLoading;
  const [post, setPost] = useState<BlogPost>(
    initialData || {
      id: 0,
      postTitle: "",
      postName: "",
      postContent: "",
      siteId: "",
      tableName: "",
      postExcerpt: "",
      postStatus: "draft",
      postAuthor: 1,
      postDate: new Date().toISOString(),
      postDateGmt: new Date().toISOString(),
      postModified: new Date().toISOString(),
      postModifiedGmt: new Date().toISOString(),
      commentStatus: "open",
      pingStatus: "open",
      postType: "post",
      postParent: 0,
      guid: "",
      menuOrder: 0,
      commentCount: 0,
      postMimeType: "",
      seoData: {
        seoTitle: "",
        metaDescription: "",
        focusKeyword: "",
        ogTitle: "",
        ogDescription: "",
        ogImage: "",
        canonicalUrl: "",
        robotsContent: "index, follow",
      },
    },
  );

  // Sync initialData if it changes (useful for edit page)
  useEffect(() => {
    if (initialData) {
      setPost(initialData);
    }
  }, [initialData]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeAccordion, setActiveAccordion] = useState<string[]>(["status", "categories", "image"]);

  const toggleAccordion = (id: string) => {
    setActiveAccordion(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const seoScore = useYoastAnalysis(
    post.postContent,
    post.postTitle,
    post.seoData,
  );

  const handleSeoChange = (field: string, value: string) => {
    setPost({ ...post, seoData: { ...post.seoData, [field]: value } });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const autoSlug =
      post.postName ||
      post.postTitle
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
    onSubmit({ ...post, postName: autoSlug });
  };

  const SidebarSection = ({ id, title, children }: { id: string, title: string, children: React.ReactNode }) => (
    <div className="border-b border-border/40">
      <button 
        type="button"
        onClick={() => toggleAccordion(id)}
        className="w-full flex items-center justify-between p-4 text-sm font-medium hover:bg-muted/50 transition-colors"
      >
        <span>{title}</span>
        {activeAccordion.includes(id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
      {activeAccordion.includes(id) && (
        <div className="p-4 pt-0 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-background">
      {/* TOP BAR */}
      <header className="h-14 border-b flex items-center justify-between px-4 bg-background sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Entradas</span>
            <ChevronRight className="w-4 h-4" />
            <span className="truncate max-w-[200px]">{post.postTitle || "Nueva entrada"}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            Guardar borrador
          </Button>
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            Vista previa <Eye className="ml-2 w-4 h-4" />
          </Button>
          <Separator orientation="vertical" className="h-6 mx-2 hidden sm:block" />
          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm px-6"
          >
            {loading ? "Guardando..." : (post.id ? "Actualizar" : "Publicar")}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={sidebarOpen ? "text-primary bg-primary/10" : ""}
          >
            <Settings2 className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto bg-background custom-scrollbar">
          <div className="max-w-[850px] mx-auto py-12 px-6 lg:px-12 space-y-8">
            <div className="space-y-4">
              <Input
                className="text-5xl font-bold h-auto py-4 border-none shadow-none focus-visible:ring-0 placeholder:opacity-30 bg-transparent px-0"
                placeholder="Añadir el título"
                value={post.postTitle || ""}
                onChange={(e) => setPost({ ...post, postTitle: e.target.value })}
              />
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground group cursor-pointer hover:text-foreground transition-colors">
                <Link2 className="w-3 h-3" />
                <span>Enlace permanente:</span>
                <span className="font-mono bg-muted/50 px-1 rounded">{post.postName || "autogenerado"}</span>
              </div>
            </div>

            <div className="min-h-[400px]">
              <div
                className="w-full min-h-[500px] text-xl leading-relaxed focus:outline-none prose prose-slate max-w-none dark:prose-invert selection:bg-primary/20"
                contentEditable={true}
                suppressContentEditableWarning={true}
                onInput={(e) => {
                  setPost({ ...post, postContent: e.currentTarget.innerHTML });
                }}
                dangerouslySetInnerHTML={{ __html: post.postContent || "" }}
                data-placeholder="Empieza a escribir o teclea / para elegir un bloque"
              />
            </div>

            <Separator className="my-12" />

            {/* YOAST SEO SECTION (At the bottom like WP) */}
            <Card className="border shadow-sm mb-20 overflow-hidden">
              <CardHeader className="bg-muted/30 border-b py-3 px-4 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  Yoast SEO
                  <div className={`w-2 h-2 rounded-full ${seoScore.color === 'green' ? 'bg-green-500' : seoScore.color === 'orange' ? 'bg-orange-500' : 'bg-red-500'}`} />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="seo" className="w-full">
                  <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-auto p-0">
                    <TabsTrigger
                      value="seo"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 text-sm font-medium"
                    >
                      SEO
                    </TabsTrigger>
                    <TabsTrigger
                      value="social"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 text-sm font-medium"
                    >
                      Social
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="seo" className="p-6 space-y-8">
                    <div className="space-y-4">
                      <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Vista previa de Google</Label>
                      <div className="bg-white dark:bg-slate-900 border rounded-lg p-6 shadow-sm">
                        <GooglePreview
                          title={post.seoData.seoTitle || post.postTitle}
                          slug={post.postName}
                          description={post.seoData.metaDescription}
                          siteDomain="tusitio.com"
                        />
                      </div>
                    </div>

                    <div className="grid gap-6 max-w-2xl">
                      <div className="space-y-2">
                        <Label htmlFor="keyword" className="text-sm font-medium">Frase clave objetivo</Label>
                        <Input
                          id="keyword"
                          placeholder="Introduce tu palabra clave..."
                          value={post.seoData.focusKeyword}
                          onChange={(e) => handleSeoChange("focusKeyword", e.target.value)}
                          className="bg-muted/20"
                        />
                        <p className="text-[11px] text-muted-foreground">Ayuda a optimizar tu contenido para esta palabra específica.</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="seoTitle" className="text-sm font-medium">Título SEO</Label>
                        <Input
                          id="seoTitle"
                          value={post.seoData.seoTitle}
                          onChange={(e) => handleSeoChange("seoTitle", e.target.value)}
                          className="bg-muted/20"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="meta" className="text-sm font-medium">Metadescripción</Label>
                        <Textarea
                          id="meta"
                          rows={3}
                          value={post.seoData.metaDescription}
                          onChange={(e) => handleSeoChange("metaDescription", e.target.value)}
                          className="bg-muted/20 resize-none"
                        />
                      </div>
                    </div>

                    <div className="pt-6 border-t flex items-start gap-4 bg-muted/20 p-4 rounded-lg">
                      <div className={`mt-1 flex-shrink-0 w-4 h-4 rounded-full shadow-sm animate-pulse`} style={{ backgroundColor: seoScore.color }} />
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold">Análisis SEO: {seoScore.message}</h4>
                        <p className="text-xs text-muted-foreground">Puntuación actual: <span className="font-bold text-foreground">{seoScore.points}/100</span></p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="social" className="p-6 space-y-6">
                    <div className="space-y-4 max-w-2xl">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Imagen para redes sociales</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="https://ejemplo.com/imagen.jpg"
                            value={post.postMimeType}
                            onChange={(e) => setPost({ ...post, postMimeType: e.target.value })}
                            className="bg-muted/20"
                          />
                          <Button variant="secondary">Elegir</Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </main>

        {/* SIDEBAR */}
        {sidebarOpen && (
          <aside className="w-[300px] lg:w-[350px] border-l bg-muted/10 overflow-y-auto hidden md:block">
            <Tabs defaultValue="post" className="w-full">
              <TabsList className="w-full justify-start rounded-none border-b bg-background h-12 p-0 px-2">
                <TabsTrigger value="post" className="rounded-none h-12 data-[state=active]:border-b-2 data-[state=active]:border-primary bg-transparent shadow-none">
                  Entrada
                </TabsTrigger>
                <TabsTrigger value="block" className="rounded-none h-12 data-[state=active]:border-b-2 data-[state=active]:border-primary bg-transparent shadow-none">
                  Bloque
                </TabsTrigger>
              </TabsList>

              <TabsContent value="post" className="m-0 border-none">
                <SidebarSection id="status" title="Resumen">
                  <div className="grid grid-cols-[100px_1fr] gap-y-3 text-xs items-center">
                    <span className="text-muted-foreground flex items-center gap-1"><Eye className="w-3 h-3" /> Visibilidad</span>
                    <span className="font-medium text-primary cursor-pointer hover:underline">Público</span>
                    
                    <span className="text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" /> Publicar</span>
                    <span className="font-medium text-primary cursor-pointer hover:underline">Inmediatamente</span>
                    
                    <span className="text-muted-foreground flex items-center gap-1"><Link2 className="w-3 h-3" /> URL</span>
                    <span className="font-medium truncate text-primary cursor-pointer hover:underline">{post.postName || "autogenerado"}</span>
                    
                    <span className="text-muted-foreground flex items-center gap-1"><User className="w-3 h-3" /> Autor</span>
                    <span className="font-medium text-primary cursor-pointer hover:underline">Usuario {post.postAuthor}</span>

                    <span className="text-muted-foreground flex items-center gap-1"><Globe className="w-3 h-3" /> Estado</span>
                    <Badge variant={post.postStatus === 'publish' ? 'default' : 'secondary'} className="w-fit scale-90 -ml-1">
                      {post.postStatus === 'publish' ? 'Publicado' : 'Borrador'}
                    </Badge>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full text-destructive border-destructive/20 hover:bg-destructive/5 mt-4">
                    Mover a la papelera
                  </Button>
                </SidebarSection>

                <SidebarSection id="categories" title="Categorías">
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                    {["Cancun & Riviera Maya Guide", "Eco Tourism", "Marine Life", "Snorkeling", "Tips"].map((cat) => (
                      <label key={cat} className="flex items-center gap-2 text-sm cursor-pointer group">
                        <div className="w-4 h-4 rounded border border-input group-hover:border-primary transition-colors" />
                        <span className="group-hover:text-primary transition-colors">{cat}</span>
                      </label>
                    ))}
                  </div>
                  <Button variant="link" size="sm" className="p-0 h-auto text-xs text-primary">Añadir nueva categoría</Button>
                </SidebarSection>

                <SidebarSection id="image" title="Imagen destacada">
                  <div className="aspect-video w-full rounded-lg border-2 border-dashed flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer group">
                    <ImageIcon className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-primary">Establecer la imagen destacada</span>
                  </div>
                </SidebarSection>

                <SidebarSection id="excerpt" title="Extracto">
                  <Textarea 
                    placeholder="Escribe un extracto (opcional)" 
                    className="text-xs bg-background min-h-[80px]"
                    value={post.postExcerpt}
                    onChange={(e) => setPost({...post, postExcerpt: e.target.value})}
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">Los extractos son descripciones cortas opcionales del contenido.</p>
                </SidebarSection>

                <SidebarSection id="seo-summary" title="Estado SEO">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1">Puntuación SEO</span>
                      <div className="flex items-center gap-1 font-medium">
                        {seoScore.points >= 70 ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <AlertCircle className="w-3 h-3 text-orange-500" />}
                        {seoScore.points}/100
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full`} style={{ width: `${seoScore.points}%`, backgroundColor: seoScore.color }} />
                    </div>
                    <p className="text-[10px] text-muted-foreground italic">"{seoScore.message}"</p>
                  </div>
                </SidebarSection>
              </TabsContent>

              <TabsContent value="block" className="m-0 p-6 text-center text-sm text-muted-foreground">
                No hay ningún bloque seleccionado.
              </TabsContent>
            </Tabs>
          </aside>
        )}
      </div>
    </div>
  );
};
