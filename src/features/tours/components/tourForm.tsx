import { Save, ArrowLeft, ImagePlus, Globe, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export function TourForm() {
  return (
    <div className="space-y-6">
      {/* Header del Formulario */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Editar Tour: ATV & Cenote</h1>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Save className="mr-2 h-4 w-4" /> Guardar Cambios
        </Button>
      </div>

      {/* Grid Principal 8 / 4 */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* COLUMNA IZQUIERDA (8 Columnas) - Contenido Pesado */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Tour</Label>
                <Input id="name" placeholder="Ej: Snorkeling with Turtles" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Descripción Principal</Label>
                <Textarea id="desc" placeholder="Escribe aquí los detalles del tour..." className="min-h-[150px]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" />
              <CardTitle className="text-lg">Configuración SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seo-title">Meta Title</Label>
                <Input id="seo-title" placeholder="Título para Google" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seo-desc">Meta Description</Label>
                <Textarea id="seo-desc" placeholder="Descripción corta para buscadores" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <ImagePlus className="w-5 h-5 text-purple-500" />
              <CardTitle className="text-lg">Galería de Imágenes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-xl p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                <p className="text-sm text-muted-foreground">Arrastra tus fotos de Cloudinary o haz clic para subir</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* COLUMNA DERECHA (4 Columnas) - Ajustes Rápidos */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Publicación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select defaultValue="draft">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Publicado (Live)</SelectItem>
                    <SelectItem value="draft">Borrador</SelectItem>
                    <SelectItem value="hidden">Oculto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Precio (USD)
                </Label>
                <Input type="number" placeholder="0.00" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Organización</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Categoría</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Elegir categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="adventure">Aventura</SelectItem>
                    <SelectItem value="water">Agua / Snorkel</SelectItem>
                    <SelectItem value="culture">Cultura / Cenotes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}