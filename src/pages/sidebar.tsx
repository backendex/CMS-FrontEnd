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
  ImageIcon,
  Map, 
  FileText, 
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
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react"; 

export function AppSidebar() {
  const navigate = useNavigate();
  const { siteId } = useParams<{ siteId: string }>();
  const [user, setUser] = useState({ name: "Cargando...", email: "..." });

  const items = [
    { title: "Dashboard", url: `/dash/${siteId}`, icon: LayoutDashboard },
    { title: "Usuarios", url: `/dash/${siteId}/users`, icon: Users },
    { title: "Tours", url: `/dash/${siteId}/tour`, icon: Map },
    { title: "Blog", url: `/dash/${siteId}/blog`, icon: FileText },
    { title: "Gestor de contenido", url: `/dash/${siteId}/contenido`, icon: PieChart },
    { title: "Biblioteca de medios", url: `/dash/${siteId}/mediaPage`, icon: ImageIcon },
    { title: "Configuración", url: `/dash/${siteId}/settings`, icon: Settings },
  ];

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user_data") || "{}");
    if (storedUser.email) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser({
        name: storedUser.name || "Usuario",
        email: storedUser.email,
      });
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

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="flex items-center justify-center p-4">
        <h2 className="text-xl font-bold tracking-tight">Mi CMS</h2>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Aplicación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="size-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 opacity-50" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="right"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user.name}</span>
                      <span className="truncate text-xs">{user.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <BadgeCheck className="mr-2 size-4" />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard className="mr-2 size-4" />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="mr-2 size-4" />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-500 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
