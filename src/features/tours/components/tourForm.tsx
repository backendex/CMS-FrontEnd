import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { getContentTypes } from "@/features/tours/api/tour.api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TourForm({ onSubmit, initialData, siteId }: any) {
  const [contentTypes, setContentTypes] = useState<{ id: string, name: string }[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.name || "",
    description: initialData?.description || "",
    priceFrom: initialData?.price || 0,
    slugGallery: initialData?.slug || "",
    metaTitle: initialData?.seotitle || "",
    metaDescription: initialData?.seodescription || "",
    status: initialData?.dynamic_data?.status || { show: initialData?.isactive ? 1 : 0, calendarOn: 1 },
    duration: initialData?.dynamic_data?.duration || "",
    minimumAge: initialData?.dynamic_data?.minimumAge || 0,
    inclusions: initialData?.dynamic_data?.inclusions || [],
    contentTypeId: initialData?.content_type_id || "", 
  });

  useEffect(() => {
    const loadTypes = async () => {
      if (siteId) {
        try {
          const types = await getContentTypes(siteId);
          setContentTypes(types);
        } catch (error) {
          console.error("Error al cargar content types:", error);
        }
      }
    };
    loadTypes();
  }, [siteId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "title") {
      const generatedSlug = value.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      setFormData({ ...formData, title: value, slugGallery: generatedSlug });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("¡Botón presionado correctamente!");

    const payload = {
      siteId: siteId, 
      contentTypeId: formData.contentTypeId, 
      name: formData.title,
      description: formData.description,
      price: formData.priceFrom,
      isactive: formData.status.show === 1,
      slug: formData.slugGallery,
      seotitle: formData.metaTitle,
      seodescription: formData.metaDescription,

      dynamic_data: {
        duration: formData.duration,
        minimumAge: formData.minimumAge,
        status: formData.status
      }
    };

    console.log("Payload a enviar:", payload);
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* COLUMNA IZQUIERDA: INFORMACIÓN BÁSICA */}
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Nombre del Tour</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="priceFrom">Precio (USD)</Label>
            <Input id="priceFrom" name="priceFrom" type="number" value={formData.priceFrom}
              onChange={(e) => setFormData({ ...formData, priceFrom: Number(e.target.value) })} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" name="description" value={formData.description}
              onChange={handleChange} className="h-32" />
          </div>
          
          {/* Campos adicionales de Dynamic Data que ya tenías */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="duration">Duración</Label>
              <Input id="duration" name="duration" value={formData.duration} onChange={handleChange} placeholder="Ej: 2 horas" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="minimumAge">Edad Mínima</Label>
              <Input id="minimumAge" name="minimumAge" type="number" value={formData.minimumAge} 
                onChange={(e) => setFormData({...formData, minimumAge: Number(e.target.value)})} />
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: CONFIGURACIÓN Y SEO */}
        <Card className="bg-slate-50/50">
          <CardContent className="pt-6 space-y-4">
            
            {/* SELECTOR DE CONTENT TYPE - Evita error 23503 */}
            <div className="grid gap-2">
              <Label htmlFor="contentTypeId">Tipo de Contenido (Molde)</Label>
              <select
                id="contentTypeId"
                name="contentTypeId"
                value={formData.contentTypeId}
                onChange={handleChange}
                required
                className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Selecciona un molde...</option>
                {contentTypes.map((content) => (
                  <option key={content.id} value={content.id}> 
                    {content.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="slugGallery">Slug (URL)</Label>
              <Input id="slugGallery" name="slugGallery" value={formData.slugGallery} onChange={handleChange} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="metaTitle">Título SEO</Label>
              <Input id="metaTitle" name="metaTitle" value={formData.metaTitle} onChange={handleChange} />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4 bg-white">
              <div className="space-y-0.5">
                <Label>Estado del Tour</Label>
                <p className="text-xs text-muted-foreground">¿Visible en la web?</p>
              </div>
              <Switch
                checked={formData.status.show === 1}
                onCheckedChange={(checked) => setFormData({
                  ...formData,
                  status: { ...formData.status, show: checked ? 1 : 0 }
                })}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      <Button type="submit" disabled={loading} className="w-full md:w-auto">
        {loading ? "Procesando..." : initialData ? "Actualizar Tour" : "Guardar Tour"}
      </Button>
    </form>
  );
}