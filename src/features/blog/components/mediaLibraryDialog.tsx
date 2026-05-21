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
import { Search, Globe, ImageIcon, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageKitUpload } from "@/features/auth/components/imageKitUpload";
import { useMedia } from "@/features/media/context/MediaContext";
import { useSite } from "@/features/sites";
import { MediaItem } from "@/features/media/types/media.types";

interface MediaLibraryDialogProps {
  onSelect: (url: string) => void;
  trigger?: React.ReactNode;
}

export const MediaLibraryDialog = ({ onSelect, trigger }: MediaLibraryDialogProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { mediaItems, isLoading, addMedia } = useMedia();
  const { activeSite } = useSite();

  const handleSelect = (url: string) => {
    onSelect(url);
    setOpen(false);
  };

  const handleUploadSuccess = (_url: string, item: MediaItem) => {
    addMedia(item);
  };

  const filtered = mediaItems.filter((item) =>
    item.fileName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <ImageIcon className="w-4 h-4" />
            Media Library
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-6 pb-2 flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-xl font-bold">Media Library</DialogTitle>
          <ImageKitUpload
            onSuccess={handleUploadSuccess}
            siteId={activeSite?.id}
          />
        </DialogHeader>

        <div className="px-6 py-2 space-y-4 flex-1 overflow-hidden flex flex-col">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <Tabs defaultValue="site" className="w-full sm:w-auto">
              <TabsList className="grid w-full grid-cols-2 sm:w-[240px]">
                <TabsTrigger value="site">This Site</TabsTrigger>
                <TabsTrigger value="global" className="flex gap-2">
                  <Globe className="h-4 w-4" /> Global
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search files..."
                className="pl-8 w-full h-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {isLoading ? (
              <div className="flex items-center justify-center h-48 text-muted-foreground gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Loading files...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-muted-foreground gap-2">
                <ImageIcon className="w-10 h-10 opacity-20" />
                <span className="text-sm">
                  {search ? "No results found for your search" : "No files in the library"}
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-6">
                {filtered.map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden group cursor-pointer border-none shadow-sm"
                    onClick={() => handleSelect(item.url)}
                  >
                    <CardContent className="p-0 relative aspect-square bg-muted">
                      <img
                        src={item.url}
                        alt={item.fileName}
                        className="object-cover w-full h-full transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button size="sm" className="h-8 font-bold">Select</Button>
                      </div>
                    </CardContent>
                    <div className="p-2">
                      <p className="text-[10px] font-bold truncate">{item.fileName}</p>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest">
                        {item.fileType}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
