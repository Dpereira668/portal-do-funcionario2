
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Bell, Home, Users } from "lucide-react";
import { Outlet } from "react-router-dom";
import SidebarMenuList, { MenuItem } from "../ui/SidebarMenuList";

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
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Administração</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenuList items={menuItems} label="Menu de Administração" />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 overflow-y-auto animate-fade-in">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
