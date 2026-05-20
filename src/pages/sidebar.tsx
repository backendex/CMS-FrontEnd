import {
  LayoutDashboard,
  Users,
  PieChart,
  Settings,
  ChevronsUpDown,
  LogOut,
  BadgeCheck,
  CreditCard,
  Bell,
  Image,
  Map, 
  FileText, 
  Zap,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react"; 

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { siteId } = useParams<{ siteId: string }>();
  const [user, setUser] = useState({ name: "Cargando...", email: "..." });

  const items = [
    { title: "Dashboard", url: `/dash/${siteId}`, icon: LayoutDashboard },
    { title: "Usuarios", url: `/dash/${siteId}/users`, icon: Users },
    { title: "Tours", url: `/dash/${siteId}/tour`, icon: Map },
    { title: "Blog", url: `/dash/${siteId}/blog`, icon: FileText },
    { title: "Gestor de contenido", url: `/dash/${siteId}/contenido`, icon: PieChart },
    { title: "Biblioteca de medios", url: `/dash/${siteId}/mediaPage`, icon: Image },
    { title: "Configuración", url: `/dash/${siteId}/settings`, icon: Settings },
  ];

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user_data") || "{}");
      if (storedUser && storedUser.email) {
        setUser({
          name: storedUser.name || "Usuario",
          email: storedUser.email,
        });
      }
    } catch (e) {
      console.error("Error parsing user_data:", e);
      setUser({ name: "Usuario", email: "" });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("mustChangePassword");
    localStorage.removeItem("activeSite");
    localStorage.removeItem("user_data"); // Limpiamos también los datos del usuario
    navigate("/login", { replace: true });
  };

  // Función para obtener las iniciales del nombre
  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-sidebar overflow-hidden transition-all duration-300">
      {/* 1. Slim Left Bar (Primary Nav - Black) */}
      <div className="w-[68px] h-full flex flex-col items-center py-6 gap-6 bg-[#121212] text-white border-r border-white/10 shrink-0 z-20">
        <Button 
          variant="ghost" 
          size="icon" 
          className="size-10 rounded-xl text-white hover:bg-white/10 transition-colors mb-2"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Zap className="size-6 text-white" />
        </Button>

        <div className="flex flex-col gap-4 flex-1">
          <Button variant="ghost" size="icon" className="size-10 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors">
            <LayoutDashboard className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" className="size-10 rounded-xl text-white hover:bg-white/10 transition-colors shadow-sm bg-white/5">
            <FileText className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" className="size-10 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors">
            <Image className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" className="size-10 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors">
            <Map className="size-5" />
          </Button>
        </div>

        <div className="flex flex-col gap-4 mt-auto">
          <Button variant="ghost" size="icon" className="size-10 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors">
            <Settings className="size-5" />
          </Button>
          <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold border border-white/20 shadow-xl cursor-pointer hover:scale-105 transition-transform text-white">
            {getInitials(user.name)}
          </div>
        </div>
      </div>

      {/* 2. Secondary Sidebar (Sub-menu - White) */}
      <div 
        className={`bg-background h-full flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-0 opacity-0 -translate-x-full' : 'w-64 opacity-100 translate-x-0 border-r shadow-sm'}`}
      >
        <div className="px-6 py-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Gestión</h2>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Panel de Control</p>
          </div>
        </div>

        <div className="flex-1 px-3 space-y-8 overflow-y-auto">
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Contenido</p>
            {items.slice(0, 4).map((item) => {
              const isActive = location.pathname.includes(item.url);
              return (
                <a 
                  key={item.title}
                  href={item.url}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group hover:bg-muted/50 ${isActive ? 'bg-muted text-foreground ring-1 ring-black/5 shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {item.icon && <item.icon className="size-4" />}
                  <span className="flex-1">{item.title}</span>
                  {isActive && <div className="size-1.5 rounded-full bg-foreground animate-in zoom-in duration-300" />}
                </a>
              );
            })}
          </div>

          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Sistema</p>
            {items.slice(4).map((item) => {
              const isActive = location.pathname.includes(item.url);
              return (
                <a 
                  key={item.title}
                  href={item.url}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group hover:bg-muted/50 ${isActive ? 'bg-muted text-foreground ring-1 ring-black/5 shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {item.icon && <item.icon className="size-4" />}
                  <span className="flex-1">{item.title}</span>
                  {isActive && <div className="size-1.5 rounded-full bg-foreground animate-in zoom-in duration-300" />}
                </a>
              );
            })}
          </div>
        </div>

        <div className="p-4 bg-muted/10">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            <span className="text-xs font-bold">Cerrar sesión</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
