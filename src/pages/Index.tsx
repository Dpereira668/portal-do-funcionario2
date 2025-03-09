
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Building2, Users, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-[#0EA5E9] to-[#F97316] flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&q=80&w=1920')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay para melhorar o contraste */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0EA5E9]/70 to-[#F97316]/70 backdrop-blur-sm" />
      
      <div className="max-w-3xl mx-auto text-center space-y-12 animate-fadeIn mb-8 relative z-10">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
            Portal do Funcionário
          </h1>
          <div className="h-1.5 w-40 bg-white/30 mx-auto rounded-full animate-pulse" />
          <p className="text-xl md:text-2xl text-white/90">
            Sistema integrado de gestão <span className="font-bold text-yellow-300">carioca</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <div className="group space-y-4 p-8 bg-white/80 backdrop-blur-sm rounded-xl border-2 border
-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
              <Building2 className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-primary">Área Administrativa</h3>
            <p className="text-sm text-gray-600">Gerencie funcionários e recursos</p>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate("/admin")}
              className="w-full text-lg font-medium group-hover:bg-primary group-hover:text-white transition-colors"
            >
              Acessar <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="group space-y-4 p-8 bg-white/90 rounded-xl border-4 border-[#F97316] shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-24 h-24 bg-[#F97316]/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
              <Users className="w-12 h-12 text-[#F97316]" />
            </div>
            <h3 className="text-xl font-semibold text-[#F97316]">Área do Funcionário</h3>
            <p className="text-sm text-gray-600">Acesse suas solicitações e informações</p>
            <Button 
              size="lg"
              onClick={() => navigate("/funcionario")}
              className="w-full bg-gradient-to-r from-[#F97316] to-[#FB923C] hover:from-[#FB923C] hover:to-[#F97316] text-lg font-medium"
            >
              Entrar <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-4 text-white/80 text-sm italic z-10">
        Inspirado na Cidade Maravilhosa - Rio de Janeiro
      </div>
    </div>
  );
};

export default Index;
