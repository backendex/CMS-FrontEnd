//Aqui se para las paginas 
import { Plus, Search, FileIcon, Copy, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function MediaPage() {
  return (
    <div className="p-6 space-y-6 h-full flex flex-col">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Biblioteca de Medios</h1>
          <p className="text-muted-foreground">Gestiona tus imágenes y archivos para los artículos.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Subir archivo
        </Button>
      </div>

      {/* 2. Barra de búsqueda y filtros */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar archivos..." className="pl-8" />
      </div>

      {/* 3. Grid de Medios */}
      <ScrollArea className="flex-1 rounded-md border bg-muted/20 p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* Ejemplo de un ítem de imagen */}
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="group relative overflow-hidden cursor-pointer hover:ring-2 ring-primary transition-all">
              <div className="aspect-square bg-muted flex items-center justify-center">
                <FileIcon className="h-10 w-10 text-muted-foreground/40" />
                {/* Aquí iría la <img src="..." /> cuando tengas datos */}
              </div>
              
              {/* Overlay de acciones rápidas */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button size="icon" variant="secondary" className="h-8 w-8">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="destructive" className="h-8 w-8">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}