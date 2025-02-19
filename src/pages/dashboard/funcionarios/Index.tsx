
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Bell, FileText, User } from "lucide-react";

const FuncionariosIndex = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Minhas Solicitações",
      description: "Gerencie suas solicitações e acompanhe o status",
      icon: Bell,
      route: "/funcionario/solicitacoes",
    },
    {
      title: "Meus Documentos",
      description: "Acesse seus documentos e declarações",
      icon: FileText,
      route: "/funcionario/documentos",
    },
    {
      title: "Meu Perfil",
      description: "Visualize e atualize suas informações",
      icon: User,
      route: "/funcionario/perfil",
    },
  ];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-primary">Dashboard</h2>
        <p className="text-muted-foreground">
          Bem-vindo ao seu painel de controle
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <Card 
            key={card.route} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(card.route)}
          >
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/5 rounded-full">
                  <card.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-medium">
                    {card.title}
                  </CardTitle>
                  <CardDescription>
                    {card.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Acessar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FuncionariosIndex;
