/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Globe, ArrowRight, ExternalLink, Activity, Lock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface Website {
  id: string;
  name: string;
  url: string;
  status: "online" | "maintenance";
  toursCount: number;
  color: string;
  hasAccess?: boolean;
}

interface SiteSelectorProps {
  initialSites: Website[];
}

export function SiteSelector({ initialSites = [] }: SiteSelectorProps) {
  const [sites, setSites] = useState<Website[]>(initialSites);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkPermissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userId = localStorage.getItem("userId"); 
      const response = await axios.get(`https://localhost:44351/api/auth/getUserAccess/${userId}`);
      
      // Soporte para camelCase y PascalCase
      const allowedSites = response.data?.allowedSites || response.data?.AllowedSites || [];

      const processedSites = initialSites.map((site) => {
        const hasPermission = allowedSites.some(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (allowed: any) => String(allowed.id).toLowerCase() === String(site.id).toLowerCase()
        );
        return { ...site, hasAccess: hasPermission };
      });

      setSites(processedSites);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error al sincronizar permisos:", err);
      setError("No pudimos verificar tus accesos.");
      // Fallback: Bloqueamos por seguridad
      setSites(initialSites.map(s => ({ ...s, hasAccess: false })));
    } finally {
      setLoading(false);
    }
  }, [initialSites]);

  useEffect(() => {
    if (initialSites?.length > 0) {
      checkPermissions();
    }
  }, [initialSites, checkPermissions]);

  // Estado de carga con el estilo del componente
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Activity className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium italic">Sincronizando ecosistemas...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Cabecera */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">CMS</h1>
        <p className="text-xl text-muted-foreground">
          Selecciona un ecosistema para editar contenidos, tours e imágenes.
        </p>
      </div>

      {/* Grid de Sitios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sites.map((site) => {
          const isBlocked = site.hasAccess === false;

          return (
            <Card 
              key={site.id} 
              className={`group overflow-hidden border-2 transition-all 
                ${isBlocked 
                  ? "opacity-60 grayscale bg-secondary/10 cursor-not-allowed" 
                  : "hover:border-primary/50 hover:shadow-xl"
                }`}
            >
              {/* Barra de color superior */}
              <div className={`h-1.5 w-full ${site.color}`} />
              
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-secondary rounded-lg">
                    {isBlocked ? (
                      <Lock className="w-6 h-6 text-muted-foreground" />
                    ) : (
                      <Globe className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  
                  <Badge 
                    variant={isBlocked ? "secondary" : (site.status === "online" ? "outline" : "secondary")} 
                    className={!isBlocked && site.status === "online" ? "text-green-600 border-green-600" : ""}
                  >
                    {isBlocked ? "Restringido" : (site.status === "online" ? "● Activo" : "○ Mantenimiento")}
                  </Badge>
                </div>
                
                <CardTitle className="text-xl font-bold pt-4">{site.name}</CardTitle>
                <CardDescription className="truncate text-xs font-mono">
                  {site.url}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Activity className="w-4 h-4" />
                  <span>{site.toursCount} Tours / Actividades</span>
                </div>
              </CardContent>

              <CardFooter className="flex gap-2 bg-secondary/30 p-4">
                <Button 
                  disabled={isBlocked}
                  className={`flex-1 font-semibold transition-colors ${!isBlocked && "group-hover:bg-primary"}`}
                  onClick={() => !isBlocked && (window.location.href = `/admin/site/${site.id}`)}
                >
                  {isBlocked ? "No Autorizado" : "Gestionar"}
                  {!isBlocked && <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />}
                </Button>
                
                <Button variant="ghost" size="icon" asChild disabled={isBlocked}>
                  <a href={isBlocked ? "#" : site.url} target="_blank" rel="noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}