
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Building2, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
      <div className="max-w-3xl mx-auto p-8 text-center space-y-12 animate-fade-in">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-primary">
            Portal do Funcionário
          </h1>
          <div className="h-1 w-32 bg-secondary mx-auto rounded-full animate-pulse" />
          <p className="text-xl text-muted-foreground">
            Sistema integrado de gestão de solicitações e recursos humanos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <div className="group space-y-4 p-6 bg-white/50 rounded-lg border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
            <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <Button 
              size="lg"
              onClick={() => navigate("/admin")}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Área Administrativa
            </Button>
          </div>

          <div className="group space-y-4 p-6 bg-white/50 rounded-lg border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
            <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <Button 
              size="lg"
              onClick={() => navigate("/funcionario")}
              variant="outline"
              className="w-full"
            >
              Área do Funcionário
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
