
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary/20 p-4">
      <div className="text-center space-y-4 animate-fadeIn">
        <h1 className="text-4xl font-bold text-primary">404</h1>
        <p className="text-xl text-gray-600 mb-4">Página não encontrada</p>
        <Button
          onClick={() => navigate("/")}
          className="bg-primary hover:bg-primary/90"
        >
          Voltar ao Início
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
