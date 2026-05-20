import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/pages/sidebar";
import { useSite } from "@/features/sites/components/siteContext";

export default function DashboardLayout() {
  console.log("DashboardLayout render - Force Refresh");
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
 
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const url = `/${pathSegments.slice(0, index + 1).join("/")}`;
    // Skip UUID-like segments (site IDs)
    if (segment.length > 20) return null;
    
    const label = routeTitles[url] || segment.charAt(0).toUpperCase() + segment.slice(1);
    return { label, url };
  }).filter(Boolean);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto flex flex-col">
        {/* Header con Migas de Pan y Acciones */}
        <header className="px-6 lg:px-10 py-3 border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer transition-colors">Admin</span>
            {breadcrumbs.map((crumb, i) => (
              <div key={crumb?.url} className="flex items-center gap-2">
                <span className="text-[10px] opacity-40">/</span>
                <a 
                  href={crumb?.url} 
                  className={`transition-colors ${i === breadcrumbs.length - 1 ? 'text-foreground font-bold' : 'hover:text-foreground'}`}
                >
                  {crumb?.label}
                </a>
              </div>
            ))}
          </nav>
        </header>

        <div className="flex-1 p-6 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}



  



 