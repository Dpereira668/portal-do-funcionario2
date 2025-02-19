
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Calendar, FileText, List, Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const SolicitacoesDoFuncionario = () => {
  const { toast } = useToast();
  const [novaSolicitacao, setNovaSolicitacao] = useState({
    tipo: "",
    dataInicio: "",
    dataFim: "",
    observacoes: "",
  });

  // Estado para controlar a ordenação e filtros
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [ordenacao, setOrdenacao] = useState("data"); // data ou status

  // Dados mockados para demonstração
  const minhasSolicitacoes = [
    {
      id: 1,
      tipo: "Férias",
      status: "Pendente",
      dataInicio: "15/04/2024",
      dataFim: "30/04/2024",
      observacoes: "Férias de 15 dias para descanso",
      icon: Calendar,
    },
    {
      id: 2,
      tipo: "Declaração",
      status: "Aprovado",
      dataInicio: "12/04/2024",
      dataFim: "12/04/2024",
      observacoes: "Declaração de vínculo empregatício",
      icon: FileText,
    },
    {
      id: 3,
      tipo: "Outros",
      status: "Rejeitado",
      dataInicio: "10/04/2024",
      dataFim: "10/04/2024",
      observacoes: "Solicitação de mudança de horário",
      icon: List,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!novaSolicitacao.tipo || !novaSolicitacao.dataInicio || !novaSolicitacao.dataFim) {
      toast({
        title: "Erro na solicitação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    // Aqui seria feita a integração com o backend
    toast({
      title: "Solicitação enviada",
      description: "Sua solicitação foi enviada com sucesso!",
    });

    // Limpa o formulário
    setNovaSolicitacao({
      tipo: "",
      dataInicio: "",
      dataFim: "",
      observacoes: "",
    });
  };

  // Filtra e ordena as solicitações
  const solicitacoesFiltradas = minhasSolicitacoes
    .filter((sol) => filtroStatus === "todos" || sol.status === filtroStatus)
    .sort((a, b) => {
      if (ordenacao === "data") {
        return new Date(b.dataInicio).getTime() - new Date(a.dataInicio).getTime();
      }
      return a.status.localeCompare(b.status);
    });

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-primary">Minhas Solicitações</h2>
          <p className="text-muted-foreground">
            Gerencie suas solicitações e acompanhe o status
          </p>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Nova Solicitação
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-[425px]">
            <SheetHeader>
              <SheetTitle>Nova Solicitação</SheetTitle>
              <SheetDescription>
                Preencha os dados para criar uma nova solicitação
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Solicitação</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={novaSolicitacao.tipo}
                  onChange={(e) =>
                    setNovaSolicitacao({
                      ...novaSolicitacao,
                      tipo: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Selecione o tipo</option>
                  <option value="ferias">Férias</option>
                  <option value="documento">Documento</option>
                  <option value="outros">Outros</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Data de Início</label>
                <Input
                  type="date"
                  value={novaSolicitacao.dataInicio}
                  onChange={(e) =>
                    setNovaSolicitacao({
                      ...novaSolicitacao,
                      dataInicio: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Data de Fim</label>
                <Input
                  type="date"
                  value={novaSolicitacao.dataFim}
                  onChange={(e) =>
                    setNovaSolicitacao({
                      ...novaSolicitacao,
                      dataFim: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Observações</label>
                <textarea
                  className="w-full p-2 border rounded-md min-h-[100px]"
                  value={novaSolicitacao.observacoes}
                  onChange={(e) =>
                    setNovaSolicitacao({
                      ...novaSolicitacao,
                      observacoes: e.target.value,
                    })
                  }
                />
              </div>
              <Button type="submit" className="w-full">
                Enviar Solicitação
              </Button>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {/* Filtros e Ordenação */}
      <div className="flex gap-4">
        <select
          className="p-2 border rounded-md"
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
        >
          <option value="todos">Todos os Status</option>
          <option value="Pendente">Pendente</option>
          <option value="Aprovado">Aprovado</option>
          <option value="Rejeitado">Rejeitado</option>
        </select>
        <select
          className="p-2 border rounded-md"
          value={ordenacao}
          onChange={(e) => setOrdenacao(e.target.value)}
        >
          <option value="data">Ordenar por Data</option>
          <option value="status">Ordenar por Status</option>
        </select>
      </div>

      <div className="grid gap-4">
        {solicitacoesFiltradas.map((solicitacao) => (
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
                    {solicitacao.dataInicio} - {solicitacao.dataFim}
                  </p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  solicitacao.status
                )}`}
              >
                {solicitacao.status}
              </span>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {solicitacao.observacoes}
              </p>
              <div className="flex justify-end">
                <Button variant="outline" size="sm">
                  Ver Detalhes
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SolicitacoesDoFuncionario;
