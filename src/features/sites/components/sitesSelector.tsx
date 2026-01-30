/* eslint-disable @typescript-eslint/no-unused-vars */
import { Globe, ArrowRight, ExternalLink, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Definimos la interfaz aquí o en un archivo de types dentro de la feature
export interface Website {
  id: number;
  name: string;
  url: string;
  status: "online" | "maintenance";
  toursCount: number;
  color: string;
}

interface SiteSelectorProps {
  sites: Website[];
}

export function SiteSelector({ sites }: SiteSelectorProps) {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          CMS
        </h1>
        <p className="text-xl text-muted-foreground">
          Selecciona un ecosistema para editar contenidos, tours e imágenes.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sites.map((site) => (
          <Card key={site.id} className="group overflow-hidden border-2 transition-all hover:border-primary/50 hover:shadow-xl">
            <div className={`h-1.5 w-full ${site.color}`} />
           
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-secondary rounded-lg">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <Badge 
                  variant={site.status === "online" ? "outline" : "secondary"} 
                  className={site.status === "online" ? "text-green-600 border-green-600" : ""}
                >
                  {site.status === "online" ? "● Activo" : "○ Mantenimiento"}
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
                className="flex-1 font-semibold group-hover:bg-primary transition-colors"
                onClick={() => window.location.href = `/admin/site/${site.id}`}
              >
                Gestionar
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href={site.url} target="_blank" rel="noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}