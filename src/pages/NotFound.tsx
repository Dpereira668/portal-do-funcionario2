
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-8 text-center space-y-6">
        <h1 className="text-4xl font-bold text-primary">Página não encontrada</h1>
        <p className="text-xl text-muted-foreground">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Button 
          size="lg"
          onClick={() => navigate("/")}
          className="bg-primary hover:bg-primary/90"
        >
          Voltar para o início
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
