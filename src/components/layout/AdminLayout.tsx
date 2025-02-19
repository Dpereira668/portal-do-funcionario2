
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Home, Users, Calendar, UserX } from "lucide-react";
import { Outlet } from "react-router-dom";
import SidebarMenuList, { MenuItem } from "../ui/SidebarMenuList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const AdminLayout = () => {
  const menuItems: MenuItem[] = [
    {
      title: "Dashboard",
      icon: Home,
      path: "/admin",
    },
    {
      title: "Solicitações",
      icon: Bell,
      path: "/admin/solicitacoes",
    },
    {
      title: "Gestão de Funcionários",
      icon: Users,
      path: "/admin/gestao-funcionarios",
    },
    {
      title: "Gestão de Férias",
      icon: Calendar,
      path: "/admin/gestao-ferias",
    },
    {
      title: "Lançamento de Faltas",
      icon: UserX,
      path: "/admin/lancamento-faltas",
    },
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <Sidebar>
            <ScrollArea className="h-full">
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Administração</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenuList items={menuItems} label="Menu de Administração" />
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </ScrollArea>
          </Sidebar>
          <main className="flex-1 overflow-hidden">
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </QueryClientProvider>
  );
};

export default AdminLayout;
