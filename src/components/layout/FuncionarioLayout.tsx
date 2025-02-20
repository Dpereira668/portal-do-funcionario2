
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Bell, User } from "lucide-react";
import { Outlet } from "react-router-dom";
import SidebarMenuList, { MenuItem } from "../ui/SidebarMenuList";

const FuncionarioLayout = () => {
  const menuItems: MenuItem[] = [
    {
      title: "Minhas Solicitações",
      description: "Visualize e gerencie suas solicitações",
      icon: Bell,
      path: "/funcionario/solicitacoes",
    },
    {
      title: "Meu Perfil",
      description: "Gerencie suas informações pessoais",
      icon: User,
      path: "/funcionario/perfil",
    },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenuList items={menuItems} label="Menu do Funcionário" />
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

export default FuncionarioLayout;
