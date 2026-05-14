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
import { cn } from "@/lib/utils";
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
  HelpCircle,
  Smile,
  Frown
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import GooglePreview from "@/features/blog/components/googlePreview";

const SidebarSection = ({
  id,
  title,
  icon: Icon,
  children,
  activeAccordion,
  toggleAccordion
}: {
  id: string,
  title: string,
  icon: any,
  children: React.ReactNode,
  activeAccordion: string[],
  toggleAccordion: (id: string) => void
}) => (
  <div className="border-b border-border/40 last:border-0">
    <button
      type="button"
      onClick={() => toggleAccordion(id)}
      className="w-full flex items-center justify-between px-6 py-6 text-[15px] font-bold hover:bg-muted/50 transition-all group"
    >
      <div className="flex items-center gap-4 text-muted-foreground group-hover:text-foreground transition-colors">
        <div className="bg-muted p-2 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
          <Icon className="w-4 h-4" />
        </div>
        <span className="tracking-tight">{title}</span>
      </div>
      <div className="bg-muted/30 p-1 rounded-full group-hover:bg-primary/10 transition-colors">
        {activeAccordion.includes(id) ? (
          <ChevronDown className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
        ) : (
          <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
    </button>
    {activeAccordion.includes(id) && (
      <div className="px-6 pb-8 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
        {children}
      </div>
    )}
  </div>
);

export const BlogForm: React.FC<BlogFormProps & { isLoading?: boolean }> = ({
  initialData,
  onSubmit,
  onDelete,
  previewUrl,
  isSubmitting,
  isLoading,
}) => {
  const { toast } = useToast();
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

  const editorRef = React.useRef<HTMLDivElement>(null);
  const isInternalUpdate = React.useRef(false);

  // Sync initialData if it changes (useful for edit page)
  useEffect(() => {
    if (initialData) {
      const updatedPost = {
        ...defaultPost,
        ...initialData,
        seoData: initialData.seoData || defaultPost.seoData
      };
      setPost(updatedPost);

      // Update editor content only when data is loaded from outside
      if (editorRef.current) {
        editorRef.current.innerHTML = updatedPost.postContent || "";
      }
    }
  }, [initialData?.id]); // Only sync when the ID changes to avoid loops during typing

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
      window.open(`/blog/${post.postName}`, "_blank", "noopener,noreferrer");
    } else {
      toast({
        title: "Vista previa no disponible",
        description: "Guarda el borrador primero para poder previsualizar la entrada.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = () => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta entrada? Esta acción no se puede deshacer.")) return;
    if (onDelete) {
      onDelete();
    } else {
      toast({
        title: "Error al eliminar",
        description: "No se puede eliminar: esta entrada todavía no ha sido guardada.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-background">
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
                ref={editorRef}
                className="w-full min-h-[500px] text-xl leading-relaxed focus:outline-none prose prose-slate max-w-none dark:prose-invert selection:bg-primary/20 placeholder:text-muted-foreground/30"
                contentEditable={true}
                suppressContentEditableWarning={true}
                onInput={(e) => {
                  const newContent = e.currentTarget.innerHTML;
                  isInternalUpdate.current = true;
                  setPost(prev => ({ ...prev, postContent: newContent }));
                }}
                data-placeholder="Empieza a escribir..."
              />
            </div>

            <Separator className="my-20 opacity-50" />

            <Card className="border-none shadow-xl shadow-primary/5 mb-24 overflow-hidden bg-white dark:bg-slate-950">
              <CardHeader className="bg-muted/20 border-b py-4 px-6 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2.5">
                  <div className="bg-primary/10 p-1.5 rounded-md">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                  </div>
                  Yoast SEO
                  <Badge
                    variant="outline"
                    className={cn(
                      "ml-2 px-2 py-0 h-5 text-[10px] font-bold uppercase tracking-wider",
                      seoScore.points >= 70
                        ? 'border-green-500/50 text-green-600 bg-green-50'
                        : seoScore.points >= 40
                          ? 'border-orange-500/50 text-orange-600 bg-orange-50'
                          : 'border-red-500/50 text-red-600 bg-red-50'
                    )}
                  >
                    {seoScore.points >= 70 ? 'Bueno' : seoScore.points >= 40 ? 'Mejorable' : 'Pobre'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="seo" className="w-full">
                  <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-auto p-0">
                    <TabsTrigger
                      value="seo"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 text-sm font-medium flex items-center gap-2"
                    >
                      {seoScore.points >= 70 ? (
                        <Smile className="w-4 h-4 text-green-500" />
                      ) : (
                        <Frown className="w-4 h-4 text-red-500" />
                      )}
                      SEO
                    </TabsTrigger>
                    <TabsTrigger
                      value="readability"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 text-sm font-medium flex items-center gap-2"
                    >
                      <Smile className="w-4 h-4 text-green-500" />
                      Legibilidad
                    </TabsTrigger>
                    <TabsTrigger
                      value="schema"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 text-sm font-medium flex items-center gap-2"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Esquema
                    </TabsTrigger>
                    <TabsTrigger
                      value="social"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 text-sm font-medium flex items-center gap-2"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
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
                    
                    {/* DETAILED ANALYSIS RESULTS */}
                    <div className="space-y-6 pt-6">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold">Resultados del análisis</h3>
                        <Badge variant="outline" className="text-[10px]">{seoScore.checks.length} resultados</Badge>
                      </div>

                      <div className="space-y-6">
                        {/* Problems */}
                        {seoScore.checks.filter(c => c.status === 'problem').length > 0 && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm font-bold text-red-600">
                              <ChevronDown className="w-4 h-4" />
                              Problemas ({seoScore.checks.filter(c => c.status === 'problem').length})
                            </div>
                            <div className="space-y-3 pl-6">
                              {seoScore.checks.filter(c => c.status === 'problem').map(check => (
                                <div key={check.id} className="flex gap-3">
                                  <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0" />
                                  <div className="text-sm">
                                    <span className="font-bold border-b border-muted-foreground/30 mr-1">{check.label}:</span>
                                    <span className="text-muted-foreground">{check.description}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Improvements / OK */}
                        {seoScore.checks.filter(c => c.status === 'ok').length > 0 && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm font-bold text-orange-600">
                              <ChevronDown className="w-4 h-4" />
                              Mejoras ({seoScore.checks.filter(c => c.status === 'ok').length})
                            </div>
                            <div className="space-y-3 pl-6">
                              {seoScore.checks.filter(c => c.status === 'ok').map(check => (
                                <div key={check.id} className="flex gap-3">
                                  <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-orange-400 flex-shrink-0" />
                                  <div className="text-sm">
                                    <span className="font-bold border-b border-muted-foreground/30 mr-1">{check.label}:</span>
                                    <span className="text-muted-foreground">{check.description}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Good Results */}
                        {seoScore.checks.filter(c => c.status === 'good').length > 0 && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm font-bold text-green-600">
                              <ChevronDown className="w-4 h-4" />
                              Resultados buenos ({seoScore.checks.filter(c => c.status === 'good').length})
                            </div>
                            <div className="space-y-3 pl-6">
                              {seoScore.checks.filter(c => c.status === 'good').map(check => (
                                <div key={check.id} className="flex gap-3">
                                  <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" />
                                  <div className="text-sm">
                                    <span className="font-bold border-b border-muted-foreground/30 mr-1">{check.label}:</span>
                                    <span className="text-muted-foreground">{check.description}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="readability" className="p-6 space-y-6">
                    <div className="bg-green-50/50 p-4 rounded-lg border border-green-100 flex gap-3">
                      <div className="bg-green-500 w-3 h-3 rounded-full mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-green-800">¡Legibilidad Excelente!</h4>
                        <p className="text-xs text-green-700">Tu texto es fácil de leer y sigue las mejores prácticas de redacción.</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm font-bold">
                        <ChevronDown className="w-4 h-4" />
                        Resultados buenos (6)
                      </div>
                      <div className="space-y-3 pl-6">
                        {[
                          { label: 'Voz pasiva', desc: '¡No estás usando demasiada voz pasiva! ¡Eso es genial!' },
                          { label: 'Frases consecutivas', desc: 'No hay repeticiones al inicio de las frases. ¡Genial!' },
                          { label: 'Distribución de subtítulos', desc: 'Estás usando subtítulos correctamente para dividir el texto.' },
                          { label: 'Longitud de párrafos', desc: '¡No hay párrafos demasiado largos! ¡Buen trabajo!' },
                          { label: 'Longitud de frases', desc: '¡Genial!' },
                          { label: 'Palabras de transición', desc: '¡Estás usando suficientes palabras de transición!' },
                        ].map((item, i) => (
                          <div key={i} className="flex gap-3">
                            <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" />
                            <div className="text-sm">
                              <span className="font-bold border-b border-muted-foreground/30 mr-1">{item.label}:</span>
                              <span className="text-muted-foreground">{item.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="schema" className="p-6 space-y-6">
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold">Configuración de esquema</h4>
                      <p className="text-xs text-muted-foreground">Define cómo se describe tu página a los motores de búsqueda usando Schema.org.</p>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg border border-dashed text-center space-y-2">
                      <FileText className="w-8 h-8 mx-auto opacity-20" />
                      <p className="text-sm font-medium">Esquema predeterminado: Artículo</p>
                      <Button variant="outline" size="sm">Cambiar tipo de esquema</Button>
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

        {sidebarOpen && (
          <aside className="w-[350px] lg:w-[400px] border-l bg-background overflow-y-auto hidden md:block shadow-xl">
            <Tabs defaultValue="post" className="w-full">
              <TabsList className="w-full justify-start rounded-none border-b bg-background h-14 p-0 px-4 gap-6">
                <TabsTrigger value="post" className="rounded-none h-14 data-[state=active]:border-b-2 data-[state=active]:border-primary bg-transparent shadow-none px-0 text-[14px] font-bold">
                  Entrada
                </TabsTrigger>
                <TabsTrigger value="block" className="rounded-none h-14 data-[state=active]:border-b-2 data-[state=active]:border-primary bg-transparent shadow-none px-0 text-[14px] font-medium opacity-60 data-[state=active]:opacity-100">
                  Bloque
                </TabsTrigger>
              </TabsList>

              <TabsContent value="post" className="m-0 border-none pb-10">
                <SidebarSection id="status" title="Resumen" icon={Info} activeAccordion={activeAccordion} toggleAccordion={toggleAccordion}>
                  <div className="space-y-5 text-[13px]">
                    <div className="flex items-center justify-between py-1">
                      <div className="text-muted-foreground flex items-center gap-3">
                        <Eye className="w-4 h-4 opacity-60" />
                        <span className="font-medium">Visibilidad</span>
                      </div>
                      <span className="font-bold text-foreground bg-muted/50 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-primary/10 hover:text-primary transition-all shadow-sm">Público</span>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <div className="text-muted-foreground flex items-center gap-3">
                        <Calendar className="w-4 h-4 opacity-60" />
                        <span className="font-medium">Publicar</span>
                      </div>
                      <span className="font-bold text-foreground bg-muted/50 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-primary/10 hover:text-primary transition-all shadow-sm">Inmediatamente</span>
                    </div>

                    <div className="flex flex-col gap-3 py-1">
                      <div className="text-muted-foreground flex items-center gap-3">
                        <Link2 className="w-4 h-4 opacity-60" />
                        <span className="font-medium">Enlace permanente</span>
                      </div>
                      <div className="font-mono text-[11px] break-all text-primary cursor-pointer hover:underline bg-primary/[0.03] px-4 py-3 rounded-xl border border-primary/10 shadow-inner">
                        {post.postName || "autogenerado"}
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <div className="text-muted-foreground flex items-center gap-3">
                        <User className="w-4 h-4 opacity-60" />
                        <span className="font-medium">Autor</span>
                      </div>
                      <span className="font-bold text-foreground bg-muted/50 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-primary/10 hover:text-primary transition-all shadow-sm">Admin User</span>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <div className="text-muted-foreground flex items-center gap-3">
                        <Globe className="w-4 h-4 opacity-60" />
                        <span className="font-medium">Estado</span>
                      </div>
                      <Badge variant={post.postStatus === 'publish' ? 'default' : 'secondary'} className="px-4 py-1 font-black uppercase tracking-widest text-[9px] rounded-full shadow-sm">
                        {post.postStatus === 'publish' ? 'Publicado' : 'Borrador'}
                      </Badge>
                    </div>
                  </div>

                  <Separator className="my-4 opacity-50" />

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full text-destructive hover:bg-destructive/5 hover:text-destructive justify-start h-11 px-4 gap-3 font-semibold border border-transparent hover:border-destructive/20 transition-all rounded-xl mt-2"
                    onClick={handleDelete}
                    disabled={!onDelete}
                  >
                    <Trash2 className="w-4 h-4" />
                    {onDelete ? "Mover a la papelera" : "Guarda primero para eliminar"}
                  </Button>
                </SidebarSection>

                <SidebarSection id="categories" title="Categorías" icon={Folder} activeAccordion={activeAccordion} toggleAccordion={toggleAccordion}>
                  <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar py-1">
                    {["Cancun & Riviera Maya Guide", "Eco Tourism", "Marine Life", "Snorkeling", "Tips"].map((cat) => (
                      <label key={cat} className="flex items-center gap-3 text-[13px] cursor-pointer group/label py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-4 h-4 rounded border-2 border-muted-foreground/30 group-hover/label:border-primary transition-all flex items-center justify-center bg-background">
                        </div>
                        <span className="text-muted-foreground group-hover/label:text-foreground font-medium transition-colors">{cat}</span>
                      </label>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full text-[12px] text-primary mt-6 font-bold hover:bg-primary/5 border-primary/20 h-10 rounded-xl">
                    + Añadir nueva categoría
                  </Button>
                </SidebarSection>

                <SidebarSection id="image" title="Imagen destacada" icon={ImageIcon} activeAccordion={activeAccordion} toggleAccordion={toggleAccordion}>
                  <div className="aspect-video w-full rounded-2xl border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center bg-muted/10 hover:bg-primary/[0.03] hover:border-primary/40 transition-all duration-300 cursor-pointer group/img overflow-hidden relative shadow-inner">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/img:opacity-100 transition-opacity" />
                    <div className="bg-background p-4 rounded-full shadow-sm mb-3 group-hover/img:scale-110 transition-transform duration-300">
                      <ImageIcon className="w-6 h-6 text-muted-foreground/50 group-hover/img:text-primary transition-colors" />
                    </div>
                    <span className="text-[12px] font-bold text-muted-foreground group-hover/img:text-primary transition-colors">Establecer imagen</span>
                    <p className="text-[10px] text-muted-foreground/50 mt-1">Suelte aquí o haga clic para subir</p>
                  </div>
                </SidebarSection>

                <SidebarSection id="excerpt" title="Extracto" icon={FileText} activeAccordion={activeAccordion} toggleAccordion={toggleAccordion}>
                  <Textarea
                    placeholder="Escribe un extracto breve..."
                    className="text-[12px] bg-background min-h-[90px] border-muted-foreground/20 focus-visible:ring-primary/30 rounded-lg resize-none"
                    value={post.postExcerpt}
                    onChange={(e) => setPost({ ...post, postExcerpt: e.target.value })}
                  />
                  <p className="text-[10px] text-muted-foreground/60 mt-2 leading-relaxed">Los extractos son descripciones cortas que suelen aparecer en las listas de blogs.</p>
                </SidebarSection>

                <SidebarSection id="seo-summary" title="Estado SEO" icon={ShieldCheck} activeAccordion={activeAccordion} toggleAccordion={toggleAccordion}>
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
