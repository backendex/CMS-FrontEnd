import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/pages/sidebar";
import { SiteProvider, useSite } from "@/features/sites/components/siteContext";

export default function DashboardLayout() {
  const location = useLocation();
  const { siteId } = useParams<{ siteId: string }>();
  const { activeSite } = useSite();
  
  console.log("Comparando:", activeSite?.id, "con", siteId);
  const routeTitles: Record<string, string> = {
    [`/dash/${siteId}`]: "Dashboard",
    [`/dash/${siteId}/users`]: "Usuarios",
    [`/dash/${siteId}/users/new`]: "Nuevo Usuario",
  };

  const currentTitle = routeTitles[location.pathname] || "Mi CMS";
  
  console.log("Guid en Contexto:", activeSite?.id);
  console.log("Guid en URL:", siteId);

  if (!activeSite) {
    return <p>Cargando configuración del sitio...</p>; 
  }
   if (String(activeSite.id) !== String(siteId)) {
    console.warn("Divergencia de IDs, redirigiendo...");
    return <Navigate to="/site" replace />;
  }
 
  return (
      <SidebarProvider defaultOpen>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-14 items-center gap-4 border-b px-4">
            <SidebarTrigger />
            <span className="text-sm font-medium text-muted-foreground">
              {currentTitle}
            </span>
          </header>
          <main className="flex flex-1 flex-col gap-6 p-4 lg:p-6 bg-background">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
  );
}



  



 