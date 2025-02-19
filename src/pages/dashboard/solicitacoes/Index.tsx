
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Coffee } from "lucide-react";

const SolicitacoesIndex = () => {
  const solicitacoes = [
    {
      id: 1,
      tipo: "Férias",
      status: "Pendente",
      data: "15/04/2024",
      funcionario: "João Silva",
      icon: Calendar,
    },
    {
      id: 2,
      tipo: "Documento",
      status: "Aprovado",
      data: "12/04/2024",
      funcionario: "Maria Santos",
      icon: FileText,
    },
    {
      id: 3,
      tipo: "Outros",
      status: "Rejeitado",
      data: "10/04/2024",
      funcionario: "Pedro Souza",
      icon: Coffee,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovado":
        return "text-green-600 bg-green-100";
      case "Rejeitado":
        return "text-red-600 bg-red-100";
      default:
        return "text-yellow-600 bg-yellow-100";
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-primary">Solicitações</h2>
        <Button className="bg-primary hover:bg-primary/90">
          Nova Solicitação
        </Button>
      </div>

      <div className="grid gap-4">
        {solicitacoes.map((solicitacao) => (
          <Card key={solicitacao.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/5 rounded-full">
                  <solicitacao.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-medium">
                    {solicitacao.tipo}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {solicitacao.funcionario}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  {solicitacao.data}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    solicitacao.status
                  )}`}
                >
                  {solicitacao.status}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm">
                  Ver Detalhes
                </Button>
                {solicitacao.status === "Pendente" && (
                  <>
                    <Button variant="outline" size="sm" className="text-red-600">
                      Rejeitar
                    </Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Aprovar
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SolicitacoesIndex;
