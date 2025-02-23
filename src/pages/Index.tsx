
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Building2, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2b4b] to-[#4fd1c5] flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl mx-auto text-center space-y-12 animate-fade-in mb-8">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
            Portal do Funcionário
          </h1>
          <div className="h-1.5 w-40 bg-white/30 mx-auto rounded-full animate-pulse" />
          <p className="text-xl md:text-2xl text-white/90">
            Sistema integrado de gestão de solicitações e recursos humanos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <div className="group space-y-4 p-8 bg-white/95 backdrop-blur-sm rounded-xl border-2 border
-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
              <Building2 className="w-10 h-10 text-primary" />
            </div>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate("/admin")}
              className="w-full text-lg font-medium"
            >
              Área Administrativa
            </Button>
          </div>

          <div className="group space-y-4 p-8 bg-white rounded-xl border-4 border-primary shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
              <Users className="w-12 h-12 text-primary" />
            </div>
            <Button 
              size="lg"
              onClick={() => navigate("/funcionario")}
              className="w-full bg-primary hover:bg-primary/90 text-lg font-medium"
            >
              Área do Funcionário
            </Button>
            <p className="text-sm text-muted-foreground">
              Acesse suas solicitações e informações
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
