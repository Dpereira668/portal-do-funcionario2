
import { Outlet } from "react-router-dom";
import { Sidebar } from "../ui/sidebar";
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

const FuncionarioLayout = () => {
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
    <div className="flex h-screen">
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
            <Sidebar.Nav>
              <Sidebar.NavItem href="/funcionario/solicitacoes" icon={ScrollText}>
                Solicitações
              </Sidebar.NavItem>
              <Sidebar.NavItem href="/funcionario/documentos" icon={FileText}>
                Documentos
              </Sidebar.NavItem>
              <Sidebar.NavItem href="/funcionario/ferias" icon={CalendarDays}>
                Férias
              </Sidebar.NavItem>
              <Sidebar.NavItem href="/funcionario/perfil" icon={UserCircle}>
                Meu Perfil
              </Sidebar.NavItem>
              <Sidebar.NavItem onClick={handleLogout} icon={LogOut}>
                Sair
              </Sidebar.NavItem>
            </Sidebar.Nav>
          </Sidebar>
        </SheetContent>
      </Sheet>

      <Sidebar className="hidden md:flex">
        <Sidebar.Nav>
          <Sidebar.NavItem href="/funcionario/solicitacoes" icon={ScrollText}>
            Solicitações
          </Sidebar.NavItem>
          <Sidebar.NavItem href="/funcionario/documentos" icon={FileText}>
            Documentos
          </Sidebar.NavItem>
          <Sidebar.NavItem href="/funcionario/ferias" icon={CalendarDays}>
            Férias
          </Sidebar.NavItem>
          <Sidebar.NavItem href="/funcionario/perfil" icon={UserCircle}>
            Meu Perfil
          </Sidebar.NavItem>
          <Sidebar.NavItem onClick={handleLogout} icon={LogOut}>
            Sair
          </Sidebar.NavItem>
        </Sidebar.Nav>
      </Sidebar>

      <main className="flex-1 overflow-y-auto bg-background">
        <Outlet />
      </main>
    </div>
  );
};

export default FuncionarioLayout;
