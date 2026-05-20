import React, { useState } from "react";
import { Search, FolderOpen, Globe, MoreVertical, Loader2, ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ImageKitUpload } from "@/features/auth/components/imageKitUpload";
import { useMedia } from "../context/MediaContext";
import { useSite } from "@/features/sites";
import { MediaItem } from "../types/media.types";
import { useToast } from "@/components/ui/use-toast";

export const MediaManager = () => {
  const { mediaItems, isLoading, error, addMedia, removeMedia } = useMedia();
  const { activeSite } = useSite();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleUploadSuccess = (_url: string, item: MediaItem) => {
    addMedia(item);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que quieres eliminar este archivo?")) return;
    setDeletingId(id);
    try {
      await removeMedia(id);
      toast({ title: "Archivo eliminado", description: "El archivo fue eliminado correctamente." });
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el archivo.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = mediaItems.filter((item) =>
    item.fileName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Biblioteca de Medios</h1>
          <p className="text-sm text-muted-foreground">
            Gestionando archivos para su uso en el CMS.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <FolderOpen className="mr-2 h-4 w-4" /> Nueva Carpeta
          </Button>
          <ImageKitUpload
            onSuccess={handleUploadSuccess}
            siteId={activeSite?.id}
          />
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
              placeholder="Buscar por nombre..."
              className="pl-8 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Estados de carga / error / vacío */}
      {isLoading && (
        <div className="flex items-center justify-center h-48 text-muted-foreground gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Cargando biblioteca de medios...</span>
        </div>
      )}

      {!isLoading && error && (
        <div className="flex items-center justify-center h-48 text-destructive text-sm">
          {error}
        </div>
      )}

      {!isLoading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground gap-3">
          <ImageIcon className="w-12 h-12 opacity-20" />
          <span className="text-sm font-medium">
            {search ? "Sin resultados para tu búsqueda" : "No hay archivos en la biblioteca. ¡Sube el primero!"}
          </span>
        </div>
      )}

      {!isLoading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map((item) => (
            <Card key={item.id} className="overflow-hidden group cursor-pointer border-muted">
              <CardContent className="p-0 relative aspect-square bg-muted flex items-center justify-center">
                <img
                  src={item.url}
                  alt={item.fileName}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 text-xs"
                    onClick={() => window.open(item.url, "_blank")}
                  >
                    Ver
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 text-xs text-white"
                    disabled={deletingId === item.id}
                    onClick={() => handleDelete(item.id)}
                  >
                    {deletingId === item.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      "Borrar"
                    )}
                  </Button>
                </div>
                <div className="absolute top-1 right-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 bg-white/50 backdrop-blur-sm hover:bg-white text-black"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigator.clipboard.writeText(item.url)}>
                        Copiar URL
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
              <div className="p-2 border-t">
                <p className="text-[11px] font-medium truncate">{item.fileName}</p>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
                  {item.fileType}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
