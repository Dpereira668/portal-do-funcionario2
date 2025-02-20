
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bell, 
  Users, 
  CalendarRange, 
  UserX, 
  AlertTriangle,
  FileText,
  UserCog,
  Building2,
  Shirt,
  BadgeHelp,
  ScrollText,
  PiggyBank,
} from "lucide-react";
import { Outlet } from "react-router-dom";
import SidebarMenuList, { MenuItem } from "../ui/SidebarMenuList";
import { useIsMobile } from "@/hooks/use-mobile";

const AdminLayout = () => {
  const isMobile = useIsMobile();

  const menuItems: MenuItem[] = [
    {
      title: "Solicitações",
      description: "Aprovação de requerimentos",
      icon: Bell,
      path: "/admin/solicitacoes",
    },
    {
      title: "Gestão de Funcionários",
      description: "Cadastro e edição de funcionários",
      icon: Users,
      path: "/admin/gestao-funcionarios",
    },
    {
      title: "Gestão de Férias",
      description: "Planejamento e aprovação de férias",
      icon: CalendarRange,
      path: "/admin/gestao-ferias",
    },
    {
      title: "Lançamento de Faltas",
      description: "Registro e controle de ausências",
      icon: UserX,
      path: "/admin/lancamento-faltas",
    },
    {
      title: "Punições",
      description: "Advertências e suspensões",
      icon: AlertTriangle,
      path: "/admin/punicoes",
    },
    {
      title: "Documentos",
      description: "Emissão de documentos oficiais",
      icon: FileText,
      path: "/admin/documentos",
    },
    {
      title: "Cargos e Funções",
      description: "Gestão de cargos e atribuições",
      icon: UserCog,
      path: "/admin/cargos",
    },
    {
      title: "Unidades",
      description: "Gestão de locais de trabalho",
      icon: Building2,
      path: "/admin/unidades",
    },
    {
      title: "Uniformes",
      description: "Controle de uniformes e EPIs",
      icon: Shirt,
      path: "/admin/uniformes",
    },
    {
      title: "Relatórios",
      description: "Geração de relatórios gerenciais",
      icon: ScrollText,
      path: "/admin/relatorios",
    },
    {
      title: "Financeiro",
      description: "Adiantamentos e reembolsos",
      icon: PiggyBank,
      path: "/admin/financeiro",
    },
    {
      title: "Ajuda",
      description: "Central de ajuda e suporte",
      icon: BadgeHelp,
      path: "/admin/faq",
    },
  ];

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen flex w-full">
        <Sidebar className="z-50">
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
        <main className="flex-1 overflow-hidden bg-background">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
