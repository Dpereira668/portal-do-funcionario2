
import { Outlet, useNavigate } from "react-router-dom";
import { Home, User } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Sidebar, SidebarProvider } from "../ui/sidebar";
import { SidebarNav, SidebarNavItem } from "../ui/SidebarNav";
import { EmployeeProfileForm } from "../funcionario/EmployeeProfileForm";
import { ScrollArea } from "../ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import * as Sentry from '@sentry/react';

const SidebarContent = () => {
  return (
    <SidebarNav>
      <SidebarNavItem href="/" icon={Home}>
        Página Inicial
      </SidebarNavItem>
      <SidebarNavItem href="/funcionario/solicitacoes" icon={Home}>
        Solicitações
      </SidebarNavItem>
      <SidebarNavItem href="/funcionario/perfil" icon={User}>
        Meu Perfil
      </SidebarNavItem>
    </SidebarNav>
  );
};

const FuncionarioLayout = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Add breadcrumb for entering funcionario layout
    Sentry.addBreadcrumb({
      category: 'navigation',
      message: 'Entered funcionario layout',
      level: 'info'
    });
    
    // Make sure the user is directed to a specific page
    if (window.location.pathname === '/funcionario') {
      navigate('/funcionario/solicitacoes');
    }
  }, [navigate]);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="flex md:hidden fixed top-4 left-4 z-50"
              size="icon"
            >
              <Home className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <Sidebar>
              <SidebarContent />
            </Sidebar>
          </SheetContent>
        </Sheet>

        <Sidebar className="hidden md:flex border-r">
          <SidebarContent />
        </Sidebar>

        <main className="flex-1 overflow-y-auto bg-background">
          <ScrollArea className="h-full">
            <div className="container max-w-5xl mx-auto px-4 py-6 md:px-8">
              {!isMobile && <EmployeeProfileForm />}
              <div className="mt-6">
                <Outlet />
              </div>
            </div>
          </ScrollArea>
        </main>
        <Toaster />
      </div>
    </SidebarProvider>
  );
};

export default FuncionarioLayout;
