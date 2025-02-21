
import { Outlet } from "react-router-dom";
import {
  CalendarDays,
  FileText,
  LogOut,
  Menu,
  ScrollText,
  UserCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Sidebar, SidebarProvider } from "../ui/sidebar";
import { SidebarNav, SidebarNavItem } from "../ui/SidebarNav";

const SidebarContent = () => {
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
        description: "Houve um problema ao tentar desconectar",
        variant: "destructive",
      });
    }
  };

  return (
    <SidebarNav>
      <SidebarNavItem href="/funcionario/solicitacoes" icon={ScrollText}>
        Solicitações
      </SidebarNavItem>
      <SidebarNavItem href="/funcionario/documentos" icon={FileText}>
        Documentos
      </SidebarNavItem>
      <SidebarNavItem href="/funcionario/ferias" icon={CalendarDays}>
        Férias
      </SidebarNavItem>
      <SidebarNavItem href="/funcionario/perfil" icon={UserCircle}>
        Meu Perfil
      </SidebarNavItem>
      <SidebarNavItem onClick={handleLogout} icon={LogOut}>
        Sair
      </SidebarNavItem>
    </SidebarNav>
  );
};

const FuncionarioLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="flex md:hidden absolute top-4 left-4"
              size="icon"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <Sidebar>
              <SidebarContent />
            </Sidebar>
          </SheetContent>
        </Sheet>

        <Sidebar className="hidden md:flex">
          <SidebarContent />
        </Sidebar>

        <main className="flex-1 overflow-y-auto bg-background">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default FuncionarioLayout;
