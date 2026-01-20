import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { SectionCards } from "@/components/ui/section-cards"

// Importamos tus datos desde el archivo JSON
import rawData from "@/pages/data.json";

export default function DashboardPage() {
  // Guardamos los datos en una constante para pasarlos como prop
  const dashboardItems = rawData; 
  console.log("Datos cargados:", rawData); // Revisa esto en la consola

    return (
    <SidebarProvider>   
      <SidebarInset>
        {/* Contenido Principal */}
        <main className="flex flex-1 flex-col gap-6 p-4 lg:p-6 bg-background">
          
          {/* 1. Sección de Tarjetas (Pasando los datos del JSON) */}
          <section>
            <SectionCards data={dashboardItems} />
          </section>

          {/* 2. Sección de Gráficos (Placeholders) */}
          <div className="grid gap-4 md:grid-cols-3">
             <div className="aspect-video rounded-xl bg-muted/50 border border-dashed flex items-center justify-center text-muted-foreground text-sm">
                Gráfico de Ventas
             </div>
             <div className="col-span-2 aspect-video rounded-xl bg-muted/50 border border-dashed flex items-center justify-center text-muted-foreground text-sm">
                Actividad Reciente
             </div>
          </div>   

          {/* 3. Bloque grande inferior */}
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/20 border border-dashed md:min-h-min flex items-center justify-center">
             <p className="text-muted-foreground">Tabla de Datos / Contenido Adicional</p>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}