import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Save,
  Loader2,
  AlertCircle,
  FileEdit,
  CheckCircle2,
  XCircle,
  ChevronDown,
} from "lucide-react";
import { getPostById, updatePost } from "@/features/blog/api/blog.api";
import { BlogPost } from "@/features/blog/types/types";
import { BlogForm } from "@/features/blog/components/blogForm";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function EditBlogPage() {
  const { siteId, id } = useParams<{ siteId: string; id: string }>();
  const navigate = useNavigate();

  // ESTADOS DE LÓGICA
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. LÓGICA DE FETCH (Carga inicial)
  useEffect(() => {
    const loadPost = async () => {
      if (!id || !siteId || siteId === "undefined") {
        setError("Faltan parámetros válidos en la URL (ID o SiteId).");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Enviamos ambos GUIDs al backend como requiere el controlador
        const data = await getPostById(id, siteId);
        setPost(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Error al cargar el blog:", err);
        setError(
          "No se pudo cargar el post. Revisa el backend (Error 500 en SeoData)",
        );
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id, siteId]);

  // 2. LÓGICA DE UPDATE (Guardar cambios)
  const handleSave = async (updatedData: BlogPost) => {
    if (!id || !siteId) return;

    setIsSaving(true);
    try {
      // Combinamos datos del formulario con identificadores de ruta
      const payload = { ...updatedData, id, siteId };
      await updatePost(id, payload);
      navigate(`/dash/${siteId}/blog`);
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("Error al guardar los cambios.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-amber-600" />
        <p className="text-muted-foreground font-medium">
          Sincronizando datos...
        </p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container max-w-2xl mx-auto py-20">
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <CardTitle>Error de Conexión</CardTitle>
            </div>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <Link to={`/dash/${siteId}/blog`}>Regresar al listado</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {/* HEADER PRINCIPAL */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link to={`/dash/${siteId}/blog`}>
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Editar blog</h1>
            <p className="text-muted-foreground">
              Actualiza la información del blog
            </p>
          </div>
        </div>

        <Button
          onClick={() => document.getElementById("blog-form-submit")?.click()}
          disabled={isSaving}
          className="bg-amber-600 hover:bg-amber-700"
        >
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {isSaving ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>

      <Separator />

      <div className="grid gap-6 grid-cols-1 md:grid-cols-12">
        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <div className="md:col-span-8 space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Editor de Contenido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <h1 className="text-4xl font-bold">{post.title}</h1>

                {/* La imagen DEBE estar dentro de una etiqueta img */}
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full my-6 rounded-lg shadow-lg"
                  />
                )}

                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>

              <BlogForm
                initialData={post}
                onSubmit={handleSave}
                isSubmitting={isSaving}
              />
              <button
                id="blog-form-submit"
                type="submit"
                form="blog-form"
                className="hidden"
              />
            </CardContent>
          </Card>
        </div>

        {/* COLUMNA DERECHA: ANÁLISIS SEO (Lo que querías anexar) */}
        <div className="md:col-span-4 space-y-6">
          <Card className="shadow-sm border-t-4 border-t-green-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <div className="flex items-center gap-2">
                <div className="bg-green-100 p-1 rounded-full">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle className="text-sm font-medium">
                  Análisis SEO
                </CardTitle>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                  Problemas{" "}
                  <Badge variant="secondary" className="bg-slate-100">
                    1
                  </Badge>
                </h4>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-xs">
                    <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                    <span>
                      Enlaces internos: No se detectaron enlaces en este post.
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                  Buenos resultados{" "}
                  <Badge variant="secondary" className="bg-slate-100">
                    3
                  </Badge>
                </h4>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-xs">
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                    <span>
                      Longitud del texto: ¡Buen trabajo! (
                      {post.content?.split(" ").length || 0} palabras).
                    </span>
                  </li>
                  <li className="flex gap-3 text-xs">
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                    <span>
                      Imagen presente: El post tiene una URL de imagen válida.
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
