
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-8 text-center space-y-8">
        <h1 className="text-4xl font-bold text-primary">Sistema de Gestão</h1>
        <p className="text-xl text-muted-foreground">
          Bem-vindo ao sistema de gestão de solicitações e recursos humanos
        </p>
        <div className="flex gap-4 justify-center">
          <Button 
            size="lg"
            onClick={() => navigate("/admin")}
            className="bg-primary hover:bg-primary/90"
          >
            Área Administrativa
          </Button>
          <Button 
            size="lg"
            onClick={() => navigate("/funcionario")}
            variant="outline"
          >
            Área do Funcionário
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
