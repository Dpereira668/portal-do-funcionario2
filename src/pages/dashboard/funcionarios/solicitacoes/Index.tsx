
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Calendar, FileText, List, Plus, Shirt } from "lucide-react";
import { useState } from "react";
import NovaSolicitacaoForm from "./components/NovaSolicitacaoForm";
import SolicitacaoCard from "./components/SolicitacaoCard";
import SolicitacoesFiltros from "./components/SolicitacoesFiltros";

const SolicitacoesDoFuncionario = () => {
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [ordenacao, setOrdenacao] = useState("data");

  const minhasSolicitacoes = [
    {
      id: 1,
      tipo: "Uniforme",
      status: "Pendente",
      dataInicio: "15/04/2024",
      dataFim: "15/04/2024",
      observacoes: "Solicitação de uniforme novo",
      detalhes: "Camisa social - Tamanho M - 2 unidades",
      icon: Shirt,
    },
    {
      id: 2,
      tipo: "Férias",
      status: "Pendente",
      dataInicio: "15/04/2024",
      dataFim: "30/04/2024",
      observacoes: "Férias de 15 dias para descanso",
      icon: Calendar,
    },
    {
      id: 3,
      tipo: "Declaração",
      status: "Aprovado",
      dataInicio: "12/04/2024",
      dataFim: "12/04/2024",
      observacoes: "Declaração de vínculo empregatício",
      icon: FileText,
    },
    {
      id: 4,
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
            <NovaSolicitacaoForm onSuccess={() => {}} />
          </SheetContent>
        </Sheet>
      </div>

      <SolicitacoesFiltros
        filtroStatus={filtroStatus}
        setFiltroStatus={setFiltroStatus}
        ordenacao={ordenacao}
        setOrdenacao={setOrdenacao}
      />

      <div className="grid gap-4">
        {solicitacoesFiltradas.map((solicitacao) => (
          <SolicitacaoCard
            key={solicitacao.id}
            {...solicitacao}
            getStatusColor={getStatusColor}
          />
        ))}
      </div>
    </div>
  );
};

export default SolicitacoesDoFuncionario;
