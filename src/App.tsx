import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/features/auth/components/sidebar"
import UsersPage from "./pages/userPages"
import RegisterPage from "./pages/registerPage"
//import { LoginForm } from "./features/auth/components/loginForm"
//import ApiTest from "@/features/auth/components/ApiTest";
import LoginPage from "@/pages/loginPage"
import ChangePasswordPage from "./pages/changePasswordPage"



function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  const routeTitles: Record<string, string> = {
    "/": "Dashboard",
    "/dash": "Dashboard",
    "/users": "Usuarios",
    "/users/new": "Registro de Usuario",
    "/settings": "Configuración",
  }

  const currentTitle = routeTitles[location.pathname] || "Mi CMS"
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4">
          <SidebarTrigger />
          <div className="h-4 w-[1px] bg-border" />
          <span className="text-sm font-medium text-muted-foreground">
            {currentTitle}
          </span>
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage/>} />
        <Route
          path="/*"
          element={
            <DashboardLayout>
              <Routes>
                <Route path="/" element={<Navigate to="/dash" replace />} />
                <Route path="/dash" element={<div>Contenido del Dashboard</div>} />
                <Route path="/users" element={<UsersPage/>}/>
                <Route path="/users/new" element={<RegisterPage/>} />
                <Route path="/change-password" element={<ChangePasswordPage />} />
                <Route path="*" element={<Navigate to="/dash" replace />} />
              </Routes>
            </DashboardLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}