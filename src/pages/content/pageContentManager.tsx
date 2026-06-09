import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPagesBySite,
  getPageById,
  createPage,
  updatePage,
  deletePage,
  PageDto,
  PageTranslationDto,
} from "@/features/pages/api/page.api";
import { RichTextEditor } from "@/components/shared/richTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import {
  Plus,
  Trash2,
  Edit2,
  Loader2,
  ArrowLeft,
  Globe,
  FileText,
  Save,
  CheckCircle,
  XCircle,
} from "lucide-react";

// Safe JSON parser for blocks_json
const getHtmlFromBlocksJson = (jsonStr: string): string => {
  if (!jsonStr) return "";
  try {
    const parsed = JSON.parse(jsonStr);
    if (typeof parsed === "string") return parsed;
    return jsonStr;
  } catch (e) {
    return jsonStr;
  }
};

export default function PageContentManager() {
  const { siteId } = useParams<{ siteId: string }>();
  const navigate = useNavigate();

  // State
  const [pages, setPages] = useState<PageDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPage, setSelectedPage] = useState<PageDto | null>(null);

  // Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newSlug, setNewSlug] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);

  // Edit Form State
  const [editSlug, setEditSlug] = useState("");
  const [editPublished, setEditPublished] = useState(false);
  const [translations, setTranslations] = useState<{
    [lang: string]: { title: string; html: string };
  }>({
    es: { title: "", html: "" },
    en: { title: "", html: "" },
  });
  const [saving, setSaving] = useState(false);
  const [activeLangTab, setActiveLangTab] = useState("es");

  const fetchPages = async () => {
    if (!siteId) return;
    setLoading(true);
    try {
      const data = await getPagesBySite(siteId);
      setPages(data);
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error al cargar páginas",
        description: "No se pudieron obtener las páginas de este sitio.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, [siteId]);

  const handleOpenCreate = () => {
    setNewSlug("");
    setNewTitle("");
    setIsCreateOpen(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteId) return;
    if (!newSlug || !newTitle) {
      toast({
        title: "Campos vacíos",
        description: "Por favor complete el slug y el título.",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    try {
      const created = await createPage(siteId, newSlug.trim().toLowerCase(), newTitle.trim());
      toast({
        title: "Página creada",
        description: "La página se ha creado correctamente.",
      });
      setIsCreateOpen(false);
      fetchPages();
      // Ir directamente al editor de la página recién creada
      handleStartEdit(created);
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error al crear",
        description: err.response?.data?.message || "No se pudo crear la página.",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleStartEdit = async (page: PageDto) => {
    setLoading(true);
    try {
      const fullPage = await getPageById(page.id);
      setSelectedPage(fullPage);
      setEditSlug(fullPage.slug);
      setEditPublished(fullPage.isPublished);

      // Pre-cargar traducciones
      const transMap: { [lang: string]: { title: string; html: string } } = {
        es: { title: "", html: "" },
        en: { title: "", html: "" },
      };

      fullPage.translations.forEach((t) => {
        const lang = t.language.toLowerCase();
        transMap[lang] = {
          title: t.title,
          html: getHtmlFromBlocksJson(t.blocksJson),
        };
      });

      setTranslations(transMap);
      setIsEditing(true);
      setActiveLangTab("es");
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error al cargar la página",
        description: "No se pudieron obtener los detalles de la página.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedPage) return;
    if (!editSlug) {
      toast({
        title: "Campo requerido",
        description: "El slug es obligatorio.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      // Mapear traducciones a DTO
      const translationsPayload: PageTranslationDto[] = Object.keys(translations).map((lang) => ({
        language: lang,
        title: translations[lang].title || translations[lang].html.replace(/<[^>]*>/g, "").slice(0, 30) || "Sin título",
        blocksJson: JSON.stringify(translations[lang].html),
      }));

      const payload = {
        slug: editSlug.trim().toLowerCase(),
        isPublished: editPublished,
        translations: translationsPayload,
      };

      await updatePage(selectedPage.id, payload);
      toast({
        title: "Cambios guardados",
        description: "La página ha sido actualizada correctamente.",
      });
      setIsEditing(false);
      setSelectedPage(null);
      fetchPages();
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error al guardar",
        description: err.response?.data?.message || "No se pudieron guardar los cambios.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (page: PageDto) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar la página "/${page.slug}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await deletePage(page.id);
      toast({
        title: "Página eliminada",
        description: "La página ha sido eliminada permanentemente.",
      });
      fetchPages();
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error al eliminar",
        description: "No se pudo eliminar la página.",
        variant: "destructive",
      });
    }
  };

  const getPageTitle = (page: PageDto, lang: string): string => {
    const trans = page.translations.find((t) => t.language.toLowerCase() === lang.toLowerCase());
    return trans ? trans.title : "—";
  };

  if (loading && !isEditing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
        <p className="mt-4 text-gray-500 font-medium text-sm">Cargando gestor de páginas...</p>
      </div>
    );
  }

  // --- EDITOR VIEW ---
  if (isEditing && selectedPage) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto p-4 animate-in fade-in duration-300">
        {/* Top Control Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsEditing(false);
                setSelectedPage(null);
              }}
              className="flex items-center gap-1.5"
            >
              <ArrowLeft size={16} /> Volver
            </Button>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Editar Página</h2>
              <p className="text-xs text-gray-500">ID: {selectedPage.id}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Label htmlFor="edit-slug" className="text-sm font-semibold">Ruta (Slug):</Label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">/</span>
                <Input
                  id="edit-slug"
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value)}
                  className="pl-5 h-9 w-[180px] text-sm"
                  placeholder="slug-pagina"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border">
              <Label htmlFor="edit-published" className="text-sm font-semibold cursor-pointer">Publicado</Label>
              <Switch
                id="edit-published"
                checked={editPublished}
                onCheckedChange={setEditPublished}
              />
            </div>

            <Button
              onClick={handleSaveEdit}
              disabled={saving}
              className="bg-black text-white hover:bg-gray-800 flex items-center gap-2 h-9"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Guardando...
                </>
              ) : (
                <>
                  <Save size={16} /> Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Translation Tabs & Editor */}
        <div className="bg-white rounded-xl border shadow-sm">
          <Tabs value={activeLangTab} onValueChange={setActiveLangTab} className="w-full">
            <div className="px-6 pt-4 border-b flex items-center justify-between">
              <TabsList className="bg-gray-100 p-0.5">
                <TabsTrigger value="es" className="flex items-center gap-1.5 px-4 py-2">
                  <Globe size={14} className="text-blue-500" /> Español (ES)
                </TabsTrigger>
                <TabsTrigger value="en" className="flex items-center gap-1.5 px-4 py-2">
                  <Globe size={14} className="text-red-500" /> Inglés (EN)
                </TabsTrigger>
              </TabsList>
              <div className="text-xs text-gray-400 font-medium flex items-center gap-1">
                <span>Modificando idioma:</span>
                <span className="font-bold text-gray-700 uppercase">{activeLangTab}</span>
              </div>
            </div>

            {["es", "en"].map((lang) => (
              <TabsContent key={lang} value={lang} className="p-6 focus-visible:outline-none space-y-6">
                <div className="space-y-1.5">
                  <Label htmlFor={`title-${lang}`} className="text-sm font-bold text-gray-700">
                    Título de la Página ({lang.toUpperCase()})
                  </Label>
                  <Input
                    id={`title-${lang}`}
                    value={translations[lang]?.title || ""}
                    onChange={(e) =>
                      setTranslations({
                        ...translations,
                        [lang]: { ...translations[lang], title: e.target.value },
                      })
                    }
                    placeholder="Escribe el título de la página aquí..."
                    className="text-lg font-medium px-4 h-12 border-gray-200 focus-visible:ring-black"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700">
                    Contenido Visual (Notion Editor)
                  </Label>
                  <div className="border rounded-xl p-3 bg-slate-50/30 min-h-[460px]">
                    <RichTextEditor
                      content={translations[lang]?.html || ""}
                      onChange={(html) =>
                        setTranslations({
                          ...translations,
                          [lang]: { ...translations[lang], html },
                        })
                      }
                      placeholder={`Escribe el contenido en ${lang === "es" ? "Español" : "Inglés"}...`}
                    />
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    );
  }

  // --- PAGES LIST VIEW ---
  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Gestor de Páginas</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Crea, traduce y administra las páginas web de tu sitio corporativo.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="bg-black text-white hover:bg-gray-800 flex items-center gap-2">
          <Plus size={16} /> Crear Página
        </Button>
      </div>

      {pages.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed flex flex-col items-center justify-center">
          <FileText className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-950">No hay páginas creadas</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-xs">
            Aún no has agregado ninguna página para este sitio. Crea una ruta ahora.
          </p>
          <Button onClick={handleOpenCreate} className="mt-4 bg-black text-white hover:bg-gray-800">
            <Plus size={16} className="mr-2" /> Crear Primera Página
          </Button>
        </div>
      ) : (
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-semibold text-gray-700">Ruta (Slug)</TableHead>
                <TableHead className="font-semibold text-gray-700">Título (ES)</TableHead>
                <TableHead className="font-semibold text-gray-700">Título (EN)</TableHead>
                <TableHead className="font-semibold text-gray-700">Estado</TableHead>
                <TableHead className="text-right font-semibold text-gray-700">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page) => (
                <TableRow key={page.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-mono text-sm text-gray-900 font-semibold">
                    /{page.slug}
                  </TableCell>
                  <TableCell className="text-gray-700 font-medium">
                    {getPageTitle(page, "es")}
                  </TableCell>
                  <TableCell className="text-gray-700 font-medium">
                    {getPageTitle(page, "en")}
                  </TableCell>
                  <TableCell>
                    {page.isPublished ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                        <CheckCircle size={12} /> Publicado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                        <XCircle size={12} /> Borrador
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartEdit(page)}
                        className="h-8 px-2.5 text-xs flex items-center gap-1"
                      >
                        <Edit2 size={12} /> Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(page)}
                        className="h-8 px-2.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-gray-200 hover:border-red-200"
                      >
                        <Trash2 size={12} /> Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Crear Nueva Página</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="slug" className="text-sm font-semibold">Ruta de la Página (Slug)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">/</span>
                <Input
                  id="slug"
                  placeholder="nosotros"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  className="pl-6"
                  required
                />
              </div>
              <p className="text-[10px] text-gray-400">
                La URL de acceso será ej: misitio.com/nosotros
              </p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="title" className="text-sm font-semibold">Título Inicial (ES)</Label>
              <Input
                id="title"
                placeholder="Quiénes Somos"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
            </div>

            <DialogFooter className="pt-4 border-t gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                disabled={creating}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-black text-white hover:bg-gray-800" disabled={creating}>
                {creating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creando...
                  </>
                ) : (
                  "Crear Página"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
