import {Outlet, useLocation } from "react-router-dom"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/pages/sidebar"


export default function DashboardLayout() {
  const location = useLocation()
  // const isPostPage = location.pathname.startsWith("/postPage")

  const routeTitles: Record<string, string> = {
    "/dash": "Dashboard",
    "/users": "Usuarios",
    "/users/new": "Registro de Usuario",
    "/postPage" : "Envio de información",
  }

  const currentTitle = routeTitles[location.pathname] || "Mi CMS"

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar/>

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
  )
}
