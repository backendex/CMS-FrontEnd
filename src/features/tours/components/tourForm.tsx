import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TourForm({ onSubmit, isLoading, initialData }: any) {
  const [formData, setFormData] = useState(initialData || {
    name: "",
    description: "",
    price: 0,
    category: "",
    isactive: true,
    seotitle: "",
    seodescription: "",
    slug: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "name") {
      // Generación automática de slug al escribir el nombre
      const generatedSlug = value.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      setFormData({ ...formData, name: value, slug: generatedSlug });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna 1: Datos Principales */}
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre del Tour</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="price">Precio (USD)</Label>
            <Input id="price" name="price" type="number" value={formData.price} 
              onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} />
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
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="seotitle">Título SEO</Label>
              <Input id="seotitle" name="seotitle" value={formData.seotitle} onChange={handleChange} />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4 bg-white">
              <div className="space-y-0.5">
                <Label>Estado del Tour</Label>
                <p className="text-xs text-muted-foreground">¿Visible en la web?</p>
              </div>
              <Switch checked={formData.isactive} 
                onCheckedChange={(checked) => setFormData({...formData, isactive: checked})} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
        {isLoading ? "Procesando..." : "Guardar Tour"}
      </Button>
    </form>
  );
}