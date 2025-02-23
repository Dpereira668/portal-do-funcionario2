
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Building2, Users } from "lucide-react";
import { EmployeeProfileForm } from "@/components/funcionario/EmployeeProfileForm";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl mx-auto text-center space-y-12 animate-fade-in mb-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            Portal do Funcionário
          </h1>
          <div className="h-1 w-32 bg-secondary mx-auto rounded-full animate-pulse" />
          <p className="text-lg md:text-xl text-muted-foreground">
            Sistema integrado de gestão de solicitações e recursos humanos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <div className="group space-y-4 p-6 bg-white/50 rounded-lg border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg order-2 md:order-1">
            <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate("/admin")}
              className="w-full"
            >
              Área Administrativa
            </Button>
          </div>

          <div className="group space-y-4 p-8 bg-white rounded-lg border-2 border-primary shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 order-1 md:order-2">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
              <Users className="w-10 h-10 text-primary" />
            </div>
            <Button 
              size="lg"
              onClick={() => navigate("/funcionario")}
              className="w-full bg-primary hover:bg-primary/90 text-lg"
            >
              Área do Funcionário
            </Button>
            <p className="text-sm text-muted-foreground">
              Faça suas solicitações
            </p>
          </div>
        </div>
      </div>

      {user && <EmployeeProfileForm />}
    </div>
  );
};

export default Index;
