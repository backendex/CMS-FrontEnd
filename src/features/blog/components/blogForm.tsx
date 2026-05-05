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
  Link2,
  ExternalLink,
  Save,
  Trash2,
  Info,
  Folder,
  FileText,
  ShieldCheck,
  Type,
  HelpCircle
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import GooglePreview from "@/features/blog/components/googlePreview";

export const BlogForm: React.FC<BlogFormProps & { isLoading?: boolean }> = ({
  initialData,
  onSubmit,
  onDelete,
  previewUrl,
  isSubmitting,
  isLoading,
}) => {
  const loading = isSubmitting || isLoading;
  const defaultPost: BlogPost = {
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
      isCornerstone: false,
      allowSearch: true,
      followLinks: true,
      metaRobotsAdvanced: "",
      breadcrumbsTitle: "",
    },
  };

  const [post, setPost] = useState<BlogPost>(
    initialData ? { ...defaultPost, ...initialData, seoData: initialData.seoData || defaultPost.seoData } : defaultPost
  );

  // Sync initialData if it changes (useful for edit page)
  useEffect(() => {
    if (initialData) {
      setPost({
        ...defaultPost,
        ...initialData,
        seoData: initialData.seoData || defaultPost.seoData
      });
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

  const handleSeoChange = (field: string, value: any) => {
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
    onSubmit({ ...post, postName: autoSlug, postStatus: "publish" });
  };

  const handleSaveDraft = () => {
    const autoSlug =
      post.postName ||
      post.postTitle
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
    onSubmit({ ...post, postName: autoSlug, postStatus: "draft" });
  };

  const handlePreview = () => {
    if (previewUrl) {
      window.open(previewUrl, "_blank", "noopener,noreferrer");
    } else if (post.postName) {
      // Fallback: open slug-based URL if no explicit previewUrl
      window.open(`/blog/${post.postName}`, "_blank", "noopener,noreferrer");
    } else {
      alert("Guarda el borrador primero para poder previsualizar la entrada.");
    }
  };

  const handleDelete = () => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta entrada? Esta acción no se puede deshacer.")) return;
    if (onDelete) {
      onDelete();
    } else {
      alert("No se puede eliminar: esta entrada todavía no ha sido guardada.");
    }
  };

  const SidebarSection = ({ id, title, icon: Icon, children }: { id: string, title: string, icon: any, children: React.ReactNode }) => (
    <div className="border-b border-border/40 last:border-0">
      <button 
        type="button"
        onClick={() => toggleAccordion(id)}
        className="w-full flex items-center justify-between p-4 text-[13px] font-semibold hover:bg-muted/30 transition-colors group"
      >
        <div className="flex items-center gap-2.5 text-muted-foreground group-hover:text-foreground transition-colors">
          <Icon className="w-4 h-4" />
          <span>{title}</span>
        </div>
        {activeAccordion.includes(id) ? <ChevronDown className="w-3.5 h-3.5 opacity-50" /> : <ChevronRight className="w-3.5 h-3.5 opacity-50" />}
      </button>
      {activeAccordion.includes(id) && (
        <div className="p-4 pt-0 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
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
          <Button variant="ghost" size="sm" className="hidden sm:flex gap-1.5" onClick={handleSaveDraft} disabled={loading}>
            <Save className="w-4 h-4" />
            Guardar borrador
          </Button>
          <Button variant="ghost" size="sm" className="hidden sm:flex gap-1.5" onClick={handlePreview} type="button">
            Vista previa <ExternalLink className="ml-1 w-3.5 h-3.5" />
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
          <div className="max-w-[900px] mx-auto py-16 px-8 lg:px-16 space-y-12">
            <div className="space-y-6">
              <Input
                className="text-5xl font-bold h-auto py-4 border-none shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/20 bg-transparent px-0 tracking-tight"
                placeholder="Escribe el título aquí..."
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
                className="w-full min-h-[500px] text-xl leading-relaxed focus:outline-none prose prose-slate max-w-none dark:prose-invert selection:bg-primary/20 placeholder:text-muted-foreground/30"
                contentEditable={true}
                suppressContentEditableWarning={true}
                onInput={(e) => {
                  setPost({ ...post, postContent: e.currentTarget.innerHTML });
                }}
                dangerouslySetInnerHTML={{ __html: post.postContent || "" }}
                data-placeholder="Empieza a escribir..."
              />
            </div>

            <Separator className="my-20 opacity-50" />

            {/* YOAST SEO SECTION (At the bottom like WP) */}
            <Card className="border-none shadow-xl shadow-primary/5 mb-24 overflow-hidden bg-white dark:bg-slate-950">
              <CardHeader className="bg-muted/20 border-b py-4 px-6 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2.5">
                  <div className="bg-primary/10 p-1.5 rounded-md">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                  </div>
                  Yoast SEO
                  <Badge variant="outline" className={`ml-2 px-2 py-0 h-5 text-[10px] font-bold uppercase tracking-wider ${seoScore.color === 'green' ? 'border-green-500/50 text-green-600 bg-green-50' : seoScore.color === 'orange' ? 'border-orange-500/50 text-orange-600 bg-orange-50' : 'border-red-500/50 text-red-600 bg-red-50'}`}>
                    {seoScore.points >= 70 ? 'Bueno' : seoScore.points >= 40 ? 'Mejorable' : 'Pobre'}
                  </Badge>
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

                    <Separator className="my-8" />

                    {/* Cornerstone Content */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base font-semibold">Contenido esencial</Label>
                          <p className="text-xs text-muted-foreground">
                            El contenido esencial debe ser el artículo más importante y extenso de tu sitio. <Button variant="link" className="p-0 h-auto text-xs">Leer más sobre contenido esencial.</Button>
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium text-muted-foreground">{post.seoData.isCornerstone ? 'Activado' : 'Desactivado'}</span>
                          <Switch 
                            checked={post.seoData.isCornerstone} 
                            onCheckedChange={(checked) => handleSeoChange("isCornerstone", checked)}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator className="my-8" />

                    {/* Advanced Section */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-lg font-bold">Avanzado</h3>
                        <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                      </div>

                      <div className="grid gap-8 max-w-2xl">
                        <div className="space-y-3">
                          <Label className="text-sm font-semibold flex items-center gap-2">
                            ¿Permitir que los motores de búsqueda muestren esta entrada en los resultados?
                            <HelpCircle className="w-3.5 h-3.5 text-muted-foreground opacity-50" />
                          </Label>
                          <Select 
                            value={post.seoData.allowSearch !== false ? "yes" : "no"} 
                            onValueChange={(val) => handleSeoChange("allowSearch", val === "yes")}
                          >
                            <SelectTrigger className="bg-muted/20 h-10">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">Sí (por defecto)</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-sm font-semibold flex items-center gap-2">
                            ¿Deberían los motores de búsqueda seguir los enlaces de esta entrada?
                            <HelpCircle className="w-3.5 h-3.5 text-muted-foreground opacity-50" />
                          </Label>
                          <div className="flex items-center gap-8 mt-1">
                            <label className="flex items-center gap-2.5 cursor-pointer group">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${post.seoData.followLinks !== false ? 'border-primary' : 'border-muted-foreground/30 group-hover:border-primary'}`}>
                                {post.seoData.followLinks !== false && <div className="w-2 h-2 rounded-full bg-primary" />}
                              </div>
                              <input 
                                type="radio" 
                                className="hidden" 
                                checked={post.seoData.followLinks !== false} 
                                onChange={() => handleSeoChange("followLinks", true)} 
                              />
                              <span className="text-sm font-medium">Sí</span>
                            </label>
                            <label className="flex items-center gap-2.5 cursor-pointer group">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${post.seoData.followLinks === false ? 'border-primary' : 'border-muted-foreground/30 group-hover:border-primary'}`}>
                                {post.seoData.followLinks === false && <div className="w-2 h-2 rounded-full bg-primary" />}
                              </div>
                              <input 
                                type="radio" 
                                className="hidden" 
                                checked={post.seoData.followLinks === false} 
                                onChange={() => handleSeoChange("followLinks", false)} 
                              />
                              <span className="text-sm font-medium">No</span>
                            </label>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-sm font-semibold flex items-center gap-2">
                            Meta robots avanzado
                            <HelpCircle className="w-3.5 h-3.5 text-muted-foreground opacity-50" />
                          </Label>
                          <Select 
                            value={post.seoData.metaRobotsAdvanced || "none"} 
                            onValueChange={(val) => handleSeoChange("metaRobotsAdvanced", val === "none" ? "" : val)}
                          >
                            <SelectTrigger className="bg-muted/20 h-10">
                              <SelectValue placeholder="Selecciona opciones..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Ninguno</SelectItem>
                              <SelectItem value="noimageindex">Sin índice de imágenes (noimageindex)</SelectItem>
                              <SelectItem value="noarchive">Sin archivo (noarchive)</SelectItem>
                              <SelectItem value="nosnippet">Sin fragmento (nosnippet)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="breadcrumbs" className="text-sm font-semibold">Título de migas de pan</Label>
                          <Input
                            id="breadcrumbs"
                            placeholder="Título para Breadcrumbs"
                            value={post.seoData.breadcrumbsTitle || ""}
                            onChange={(e) => handleSeoChange("breadcrumbsTitle", e.target.value)}
                            className="bg-muted/20 h-10"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="canonical" className="text-sm font-semibold">URL Canónica</Label>
                          <Input
                            id="canonical"
                            placeholder="https://ejemplo.com/pagina"
                            value={post.seoData.canonicalUrl || ""}
                            onChange={(e) => handleSeoChange("canonicalUrl", e.target.value)}
                            className="bg-muted/20 h-10"
                          />
                        </div>
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

              <TabsContent value="post" className="m-0 border-none pb-10">
                <SidebarSection id="status" title="Resumen" icon={Info}>
                  <div className="grid grid-cols-[90px_1fr] gap-y-4 text-[12px] items-center">
                    <span className="text-muted-foreground flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Visibilidad</span>
                    <span className="font-semibold text-primary cursor-pointer hover:underline underline-offset-4 decoration-primary/30">Público</span>
                    
                    <span className="text-muted-foreground flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Publicar</span>
                    <span className="font-semibold text-primary cursor-pointer hover:underline underline-offset-4 decoration-primary/30">Inmediatamente</span>
                    
                    <span className="text-muted-foreground flex items-center gap-1.5"><Link2 className="w-3.5 h-3.5" /> URL</span>
                    <span className="font-mono text-[11px] truncate text-primary cursor-pointer hover:underline bg-primary/5 px-1.5 py-0.5 rounded">{post.postName || "autogenerado"}</span>
                    
                    <span className="text-muted-foreground flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Autor</span>
                    <span className="font-semibold text-primary cursor-pointer hover:underline underline-offset-4 decoration-primary/30">Admin User</span>

                    <span className="text-muted-foreground flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Estado</span>
                    <Badge variant={post.postStatus === 'publish' ? 'default' : 'secondary'} className="w-fit text-[10px] h-5">
                      {post.postStatus === 'publish' ? 'Publicado' : 'Borrador'}
                    </Badge>
                  </div>
                  
                  <Separator className="my-4 opacity-50" />
                  
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive justify-start h-9 px-3 gap-2.5 font-medium"
                    onClick={handleDelete}
                    disabled={!onDelete}
                  >
                    <Trash2 className="w-4 h-4" />
                    {onDelete ? "Mover a la papelera" : "Guarda primero para eliminar"}
                  </Button>
                </SidebarSection>

                <SidebarSection id="categories" title="Categorías" icon={Folder}>
                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar py-1">
                    {["Cancun & Riviera Maya Guide", "Eco Tourism", "Marine Life", "Snorkeling", "Tips"].map((cat) => (
                      <label key={cat} className="flex items-center gap-2.5 text-[13px] cursor-pointer group/label py-0.5">
                        <div className="w-4 h-4 rounded border-2 border-muted-foreground/30 group-hover/label:border-primary transition-all flex items-center justify-center">
                          {/* Custom checkbox simulation */}
                        </div>
                        <span className="text-muted-foreground group-hover/label:text-foreground transition-colors">{cat}</span>
                      </label>
                    ))}
                  </div>
                  <Button variant="link" size="sm" className="p-0 h-auto text-[11px] text-primary mt-2 font-semibold">Añadir nueva categoría</Button>
                </SidebarSection>

                <SidebarSection id="image" title="Imagen destacada" icon={ImageIcon}>
                  <div className="aspect-video w-full rounded-xl border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center bg-muted/5 hover:bg-muted/10 hover:border-primary/30 transition-all cursor-pointer group/img overflow-hidden relative">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/img:opacity-100 transition-opacity" />
                    <ImageIcon className="w-7 h-7 text-muted-foreground/50 group-hover/img:text-primary transition-colors mb-2.5" />
                    <span className="text-[11px] font-semibold text-muted-foreground group-hover/img:text-primary transition-colors">Establecer imagen</span>
                  </div>
                </SidebarSection>

                <SidebarSection id="excerpt" title="Extracto" icon={FileText}>
                  <Textarea 
                    placeholder="Escribe un extracto breve..." 
                    className="text-[12px] bg-background min-h-[90px] border-muted-foreground/20 focus-visible:ring-primary/30 rounded-lg resize-none"
                    value={post.postExcerpt}
                    onChange={(e) => setPost({...post, postExcerpt: e.target.value})}
                  />
                  <p className="text-[10px] text-muted-foreground/60 mt-2 leading-relaxed">Los extractos son descripciones cortas que suelen aparecer en las listas de blogs.</p>
                </SidebarSection>

                <SidebarSection id="seo-summary" title="Estado SEO" icon={ShieldCheck}>
                  <div className="space-y-4 p-1">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-muted-foreground font-medium">Puntuación</span>
                      <div className="flex items-center gap-1.5 font-bold">
                        {seoScore.points >= 70 ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <AlertCircle className="w-3.5 h-3.5 text-orange-500" />}
                        <span className={seoScore.points >= 70 ? 'text-green-600' : 'text-orange-600'}>{seoScore.points}/100</span>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden border border-muted-foreground/5">
                      <div className={`h-full rounded-full transition-all duration-500`} style={{ width: `${seoScore.points}%`, backgroundColor: seoScore.color }} />
                    </div>
                    <div className="bg-muted/30 p-2.5 rounded-lg border border-muted-foreground/5">
                      <p className="text-[10px] text-muted-foreground italic leading-relaxed text-center">"{seoScore.message}"</p>
                    </div>
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
