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

  const routeTitles: Record<string, string> = {
    "/dash": "Dashboard",
    "/users": "Usuarios",
    "/users/new": "Registro de Usuario",
    "/postPage": "Envío de información",
  };
  const currentTitle = routeTitles[location.pathname] || "Mi CMS";
  const { siteId } = useParams();
  const { activeSite } = useSite();

  if (!activeSite || activeSite.id !== Number(siteId)) {
    return <Navigate to="/dash" replace />;
  }

  return (
    <SiteProvider>
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
    </SiteProvider>
  );
}
