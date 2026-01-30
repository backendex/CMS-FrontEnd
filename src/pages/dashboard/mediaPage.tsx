import { useState } from "react"; // 1. Agregamos useState
import { Search, FolderOpen, Globe, MoreVertical} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { CloudinaryUpload } from "@/features/auth/components/cloudinaryUpload";

export default function MediaPage() {
  const [mediaItems, setMediaItems] = useState([
    { id: 1, url: "https://picsum.photos/seed/51/400/400", name: "hero-banner-v2.jpg", size: "1.2 MB", format: "JPG" },
    { id: 2, url: "https://picsum.photos/seed/52/400/400", name: "footer-logo.png", size: "0.5 MB", format: "PNG" },
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUploadSuccess = (url: string, metadata: any) => {
    const newMedia = {
      id: metadata.public_id, // Usamos el ID real de Cloudinary
      url: url,
      name: metadata.original_filename + "." + metadata.format,
      size: `${(metadata.bytes / 1024 / 1024).toFixed(1)} MB`,
      format: metadata.format.toUpperCase(),
    };
    setMediaItems((prev) => [newMedia, ...prev]);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Biblioteca de Medios</h1>
          <p className="text-sm text-muted-foreground">
            Gestionando archivos para: <span className="font-medium text-primary text-black">Mi Proyecto CMS</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <FolderOpen className="mr-2 h-4 w-4" /> Nueva Carpeta
          </Button>
          <CloudinaryUpload onSuccess={handleUploadSuccess} />
        </div>
      </div>
      <Card className="p-2">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <Tabs defaultValue="site" className="w-full lg:w-auto">
            <TabsList className="grid w-full grid-cols-2 lg:w-[300px]">
              <TabsTrigger value="site">Esta Web</TabsTrigger>
              <TabsTrigger value="global" className="flex gap-2">
                <Globe className="h-4 w-4" /> Global
              </TabsTrigger>
            </TabsList>
          </Tabs>        
          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nombre o etiqueta..."
              className="pl-8 w-full"
            />
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {mediaItems.map((item) => (
          <Card key={item.id} className="overflow-hidden group cursor-pointer border-muted">
            <CardContent className="p-0 relative aspect-square bg-muted flex items-center justify-center">
              <img
                src={item.url}
                alt={item.name}
                className="object-cover w-full h-full transition-transform group-hover:scale-105"
              />             
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                 <Button size="sm" variant="secondary" className="h-8 text-xs" onClick={() => window.open(item.url, '_blank')}>Ver</Button>
                 <Button size="sm" variant="destructive" className="h-8 text-xs text-white">Borrar</Button>
              </div>
              <div className="absolute top-1 right-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/50 backdrop-blur-sm hover:bg-white text-black">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(item.url)}>
                      Copiar URL
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Eliminar</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
            <div className="p-2 border-t">
              <p className="text-[11px] font-medium truncate">{item.name}</p>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{item.size} • {item.format}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}