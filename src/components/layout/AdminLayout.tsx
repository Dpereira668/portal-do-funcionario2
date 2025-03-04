import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarProvider,
  SidebarFooter,
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
  Mail,
  ScrollText,
  PiggyBank,
  LogOut,
} from "lucide-react";
import { Outlet } from "react-router-dom";
import SidebarMenuList, { MenuItem } from "../ui/SidebarMenuList";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const AdminLayout = () => {
  const isMobile = useIsMobile();
  const { signOut } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro ao sair",
        description: "Não foi possível realizar o logout",
        variant: "destructive",
      });
    }
  };

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
      path: "/admin/ferias",
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
      description: "Gestão de documentos",
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
      title: "Postos",
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
      description: "Cobranças e pagamentos",
      icon: PiggyBank,
      path: "/admin/financeiro",
    },
    {
      title: "Convites",
      description: "Gerenciar convites para administradores",
      icon: Mail,
      path: "/admin/convites",
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
          <SidebarFooter className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair do Sistema
            </Button>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 overflow-hidden bg-background">
          <Outlet />
        </main>
        <Toaster />
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
