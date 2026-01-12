import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function DashboardPage() {
  return (
    <SidebarProvider>   
      {/* Eliminamos 'bg-zinc-950' para usar el fondo por defecto */}
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Contenedor principal con colores claros (muted) */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
          
          {/* Fila de 3 bloques superiores con aspecto suave */}
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50 border" />
            <div className="aspect-video rounded-xl bg-muted/50 border" />
            <div className="aspect-video rounded-xl bg-muted/50 border" />
          </div>         
          {/* Bloque grande inferior */}
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 border md:min-h-min" />
        </div>
      </SidebarInset>
      
    </SidebarProvider>
  )
}
