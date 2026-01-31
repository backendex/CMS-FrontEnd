import { Save, Layout, Info, Phone, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ContentManager() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestión de Contenido Estático</h1>
          <p className="text-muted-foreground">Modifica los textos principales y la narrativa de tu sitio web.</p>
        </div>
        <Button className="bg-primary">
          <Save className="mr-2 h-4 w-4" /> Guardar Todo
        </Button>
      </div>

      <Tabs defaultValue="home" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="home" className="flex gap-2">
            <Layout className="w-4 h-4" /> Inicio
          </TabsTrigger>
          <TabsTrigger value="about" className="flex gap-2">
            <Info className="w-4 h-4" /> Nosotros
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex gap-2">
            <Phone className="w-4 h-4" /> Contacto
          </TabsTrigger>
          <TabsTrigger value="footer" className="flex gap-2">
            <Share2 className="w-4 h-4" /> Footer
          </TabsTrigger>
        </TabsList>

        {/* CONTENIDO DE LA HOME */}
        <TabsContent value="home">
          <Card>
            <CardHeader>
              <CardTitle>Sección Principal (Hero)</CardTitle>
              <CardDescription>Los primeros textos que ven los usuarios al entrar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Título Principal (H1)</Label>
                  <Input placeholder="Ej: La mejor aventura en Cancún" />
                </div>
                <div className="space-y-2">
                  <Label>Subtítulo</Label>
                  <Input placeholder="Ej: Vive experiencias inolvidables" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Texto del Botón Principal</Label>
                <Input className="max-w-[200px]" placeholder="Ej: Reservar Ahora" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CONTENIDO DE NOSOTROS */}
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>Nuestra Historia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Título de Sección</Label>
                <Input placeholder="Sobre Nosotros" />
              </div>
              <div className="space-y-2">
                <Label>Contenido (Párrafo 1)</Label>
                <Textarea className="min-h-[100px]" />
              </div>
              <div className="space-y-2">
                <Label>Nuestra Misión</Label>
                <Textarea className="min-h-[100px]" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Los otros Tabs seguirían el mismo patrón... */}
      </Tabs>
    </div>
  );
}