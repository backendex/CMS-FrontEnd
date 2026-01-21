import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"



// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PostForm({ initialData }: { initialData?: any }) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [slug, setSlug] = useState(initialData?.slug || "")

  // Efecto para auto-generar el slug al escribir el título
  useEffect(() => {
    const generatedSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSlug(generatedSlug)
  }, [title])

  return (
    <form className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* COLUMNA PRINCIPAL (Editor) */}
      <div className="lg:col-span-3 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-lg font-bold">Título de la Entrada</Label>
          <Input 
            id="title"
            placeholder="Ej: 10 consejos para Tailwind v4" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl py-6"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Contenido</Label>
          <Textarea 
            id="content"
            placeholder="Escribe tu historia aquí..."
            className="min-h-[500px] text-base leading-relaxed"
          />
        </div>
      </div>

      {/* BARRA LATERAL (Configuración) */}
      <aside className="space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select defaultValue="draft">
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Borrador</SelectItem>
                  <SelectItem value="published">Publicado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input 
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="bg-muted"
              />
            </div>

            <div className="pt-4">
              <Button className="w-full">Guardar Cambios</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Label>Imagen Destacada</Label>
            <div className="mt-2 border-2 border-dashed rounded-lg p-4 text-center hover:bg-muted/50 cursor-pointer">
              <span className="text-sm text-muted-foreground">Subir imagen</span>
            </div>
          </CardContent>
        </Card>
      </aside>
    </form>
  )
}