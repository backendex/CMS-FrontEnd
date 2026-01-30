import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast"; // Ajusta según tu ruta de toast
import { useEffect } from "react";
interface CloudinaryUploadProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSuccess: (url: string, metadata: any) => void;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cloudinary: any;
  }
}

export const CloudinaryUpload = ({ onSuccess }: CloudinaryUploadProps) => {
  const { toast } = useToast()

// Dentro de tu componente CloudinaryUpload:
useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://upload-widget.cloudinary.com/global/all.js";
  script.async = true;
  document.body.appendChild(script);

  return () => {
    document.body.removeChild(script);
  };

}, []);
  const handleUpload = () => {
    if (!window.cloudinary) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El script de Cloudinary no se ha cargado.",
      });
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "depikrkrz", 
        uploadPreset: "ml_default",  
        sources: ["local", "url", "camera"],
        multiple: false,
        theme: "minimal",
        clientAllowedFormats: ["png", "jpeg", "jpg", "webp"],
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          onSuccess(result.info.secure_url, result.info);
          toast({
            title: "¡Imagen subida!",
            description: "El archivo ya está en la nube.",
          });
        }
      }
    );
    widget.open();
  };

  return (
    <Button size="sm" onClick={handleUpload} className="bg-black/90 text-white hover:bg-black">
      <Upload className="mr-2 h-4 w-4" /> Subir Multimedia
    </Button>
  );
};

//export default CloudinaryUpload;

