import React, { useRef, useState } from "react";
import { upload } from "@imagekit/react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { saveMedia } from "@/features/media/api/media.api";
import { MediaItem, SaveMediaDto } from "@/features/media/types/media.types";
import { getImageKitAuth } from "@/features/media/api/media.api";

interface ImageKitUploadProps {
  onSuccess: (url: string, data: MediaItem) => void;
  siteId?: string;
}

export const ImageKitUpload = ({ onSuccess, siteId }: ImageKitUploadProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    toast({
      title: "Subiendo...",
      description: "Estamos procesando tu imagen.",
    });

    try {
      // 1. Obtener credenciales de autenticación desde el backend
      const auth = await getImageKitAuth();

      const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY || "public_test_key";

      // 2. Subir a ImageKit usando las credenciales del backend
      const response = await upload({
        file: file,
        fileName: file.name,
        publicKey: publicKey,
        signature: auth.signature,
        expire: auth.expire,
        token: auth.token,
        useUniqueFileName: true,
      } as any);

      let savedItem: MediaItem | null = null;

      // 3. Si tenemos siteId, persistir los metadatos en el backend
      if (siteId) {
        const dto: SaveMediaDto = {
          url: response.url,
          fileId: response.fileId,
          fileName: response.name,
          fileType: response.fileType || file.type,
          siteId: siteId,
        };
        savedItem = await saveMedia(dto);
      }

      // 4. Notificar éxito — usamos el objeto del backend si existe, si no construimos uno temporal
      const mediaItem: MediaItem = savedItem ?? {
        id: 0,
        url: response.url,
        fileId: response.fileId,
        fileName: response.name,
        fileType: response.fileType || file.type,
        siteId: siteId ?? "",
        createdAt: new Date().toISOString(),
      };

      onSuccess(response.url, mediaItem);

      toast({
        title: "¡Éxito!",
        description: "Imagen subida correctamente.",
      });
    } catch (err) {
      console.error("Upload error:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo subir la imagen.",
      });
    } finally {
      setIsUploading(false);
      // Resetear input para permitir subir el mismo archivo de nuevo
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="inline-block">
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        disabled={isUploading}
      />
      <Button
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        className="bg-black/90 text-white hover:bg-black"
        disabled={isUploading}
      >
        {isUploading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Upload className="mr-2 h-4 w-4" />
        )}
        {isUploading ? "Subiendo..." : "Subir imagen"}
      </Button>
    </div>
  );
};
