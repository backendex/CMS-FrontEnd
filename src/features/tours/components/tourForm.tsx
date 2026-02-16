import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TourForm({ onSubmit, initialData }: any) {
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
  });

  const [loading,] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Nombre del Tour</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="priceFrom">Precio (USD)</Label>
            <Input id="priceFrom" name="priceFrom" type="number" value={formData.priceFrom} 
              onChange={(e) => setFormData({...formData, priceFrom: Number(e.target.value)})} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" name="description" value={formData.description} 
              onChange={handleChange} className="h-32" />
          </div>
        </div>

        <Card className="bg-slate-50/50">
          <CardContent className="pt-6 space-y-4">
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