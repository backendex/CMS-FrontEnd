import React, { useRef } from "react";
import { upload } from "@imagekit/react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ImageKitUploadProps {
  onSuccess: (url: string, data: any) => void;
}

export const ImageKitUpload = ({ onSuccess }: ImageKitUploadProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      toast({
        title: "Subiendo...",
        description: "Estamos procesando tu imagen.",
      });

      // Obtenemos las credenciales de las variables de entorno
      const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY || "public_test_key";
      const urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/test";
      const authenticationEndpoint = `${import.meta.env.VITE_API_URL}/auth/imagekit`;
      
      const response = await upload({
        file: file,
        fileName: file.name,
        publicKey: publicKey,
        urlEndpoint: urlEndpoint,
        authenticationEndpoint: authenticationEndpoint,
        useUniqueFileName: true,
      });

      onSuccess(response.url, response);
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
      />
      <Button 
        size="sm" 
        onClick={() => fileInputRef.current?.click()}
        className="bg-black/90 text-white hover:bg-black"
      >
        <Upload className="mr-2 h-4 w-4" /> Subir a ImageKit
      </Button>
    </div>
  );
};
