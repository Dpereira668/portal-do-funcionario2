
import { Outlet } from "react-router-dom";
import { Home } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Sidebar, SidebarProvider } from "../ui/sidebar";
import { SidebarNav, SidebarNavItem } from "../ui/SidebarNav";

const SidebarContent = () => {
  return (
    <SidebarNav>
      <SidebarNavItem href="/" icon={Home}>
        Página Inicial
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
              <Home className="h-6 w-6" />
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
