import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Globe, ImageIcon, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageKitUpload } from "@/features/auth/components/imageKitUpload";
import { useMedia } from "@/features/media/context/MediaContext";

interface MediaLibraryDialogProps {
  onSelect: (url: string) => void;
  trigger?: React.ReactNode;
}

export const MediaLibraryDialog = ({ onSelect, trigger }: MediaLibraryDialogProps) => {
  const [open, setOpen] = useState(false);
  const { mediaItems, addMedia } = useMedia();

  const handleSelect = (url: string) => {
    onSelect(url);
    setOpen(false);
  };

  const handleUploadSuccess = (url: string, res: any) => {
    addMedia({
      id: res.fileId,
      url: url,
      name: res.name,
      size: `${(res.size / 1024 / 1024).toFixed(1)} MB`,
      format: res.fileType.toUpperCase(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <ImageIcon className="w-4 h-4" />
            Biblioteca de Medios
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-6 pb-2 flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-xl font-bold">Biblioteca de Medios</DialogTitle>
          <ImageKitUpload onSuccess={handleUploadSuccess} />
        </DialogHeader>

        <div className="px-6 py-2 space-y-4 flex-1 overflow-hidden flex flex-col">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <Tabs defaultValue="site" className="w-full sm:w-auto">
              <TabsList className="grid w-full grid-cols-2 sm:w-[240px]">
                <TabsTrigger value="site">Esta Web</TabsTrigger>
                <TabsTrigger value="global" className="flex gap-2">
                  <Globe className="h-4 w-4" /> Global
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar archivos..."
                className="pl-8 w-full h-9"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-6">
              {mediaItems.map((item) => (
                <Card 
                  key={item.id} 
                  className="overflow-hidden group cursor-pointer border-muted hover:border-primary transition-all shadow-sm"
                  onClick={() => handleSelect(item.url)}
                >
                  <CardContent className="p-0 relative aspect-square bg-muted">
                    <img
                      src={item.url}
                      alt={item.name}
                      className="object-cover w-full h-full transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button size="sm" className="h-8 font-bold">Seleccionar</Button>
                    </div>
                  </CardContent>
                  <div className="p-2 border-t">
                    <p className="text-[10px] font-bold truncate">{item.name}</p>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-widest">{item.size}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
