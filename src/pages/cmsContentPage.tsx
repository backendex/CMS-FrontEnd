/* eslint-disable @typescript-eslint/no-unused-vars */
//front
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save, Eye, Trash2 } from "lucide-react";

export function CMSContentEditor() {
  const [isEditing] = useState(true); // Podrías cambiar esto según la ruta
  return (
    <div className="space-y-6">
      {/* Header con Acciones */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEditing ? "Editar Artículo" : "Crear Nuevo Contenido"}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" /> Previsualizar
          </Button>
          <Button className=" bg-black/90">
            <Save className="mr-2 h-4 w-4" /> Guardar Cambios
          </Button>
        </div>
      </div>
      <Separator />
      {/* Grid Principal: 3 columnas (8 para editor, 4 para sidebar) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Columna Principal (Izquierda) */}
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contenido Principal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título del Post</Label>
                <Input
                  id="title"
                  placeholder="Introduce un título impactante..."
                  className="text-lg font-medium"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Cuerpo del Contenido</Label>
                <Textarea
                  id="content"
                  placeholder="Escribe aquí tu contenido..."
                  className="min-h-[400px] leading-relaxed"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Barra Lateral (Derecha) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card de Publicación */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                Publicación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Estado:</span>
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-800"
                >
                  Borrador
                </Badge>
              </div>
              <div className="space-y-2">
                <Label>Visibilidad</Label>
                <Select defaultValue="public">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Público</SelectItem>
                    <SelectItem value="private">Privado</SelectItem>
                    <SelectItem value="scheduled">Programado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <Button variant="destructive" className="w-full">
                <Trash2 className="mr-2 h-4 w-4" /> Mover a la papelera
              </Button>
            </CardContent>
          </Card>
          {/* Card de Organización */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                Organización
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Categoría</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="news">Noticias</SelectItem>
                    <SelectItem value="tutorial">Tutorial</SelectItem>
                    <SelectItem value="update">Actualizaciones</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Imagen Destacada</Label>
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:bg-slate-50 cursor-pointer transition-colors">
                  <span className="text-xs text-muted-foreground">
                    Click para subir imagen
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
