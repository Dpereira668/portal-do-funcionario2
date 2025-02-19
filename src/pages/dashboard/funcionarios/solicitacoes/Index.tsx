
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Calendar, FileText, Shirt } from "lucide-react";
import { useState } from "react";
import NovaSolicitacaoForm from "./components/NovaSolicitacaoForm";
import SolicitacaoCard from "./components/SolicitacaoCard";
import SolicitacoesFiltros from "./components/SolicitacoesFiltros";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

const SolicitacoesDoFuncionario = () => {
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [ordenacao, setOrdenacao] = useState("data");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [tipoSolicitacao, setTipoSolicitacao] = useState("");
  const { user } = useAuth();

  const { data: solicitacoes = [], isLoading } = useQuery({
    queryKey: ['solicitacoes', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case 'uniforme':
        return Shirt;
      case 'ferias':
        return Calendar;
      case 'documento':
        return FileText;
      default:
        return FileText;
    }
  };

  const formatRequestDetails = (request: any) => {
    switch (request.type) {
      case 'uniforme':
        return `${request.uniform_type} - Tamanho ${request.uniform_size} - ${request.uniform_quantity} unidade(s)`;
      case 'ferias':
        return `Período: ${format(new Date(request.start_date), 'dd/MM/yyyy')} a ${format(new Date(request.end_date), 'dd/MM/yyyy')}`;
      case 'documento':
        return `Data: ${format(new Date(request.start_date), 'dd/MM/yyyy')}`;
      default:
        return request.notes;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aprovado":
        return "text-green-600 bg-green-100";
      case "rejeitado":
        return "text-red-600 bg-red-100";
      default:
        return "text-yellow-600 bg-yellow-100";
    }
  };

  const handleOpenSheet = (tipo: string) => {
    setTipoSolicitacao(tipo);
    setIsSheetOpen(true);
  };

  const solicitacoesFiltradas = solicitacoes
    .filter((sol: any) => filtroStatus === "todos" || sol.status === filtroStatus)
    .sort((a: any, b: any) => {
      if (ordenacao === "data") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return a.status.localeCompare(b.status);
    });

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-primary">Minhas Solicitações</h2>
        <p className="text-muted-foreground mb-6">
          Gerencie suas solicitações e acompanhe o status
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button 
                onClick={() => handleOpenSheet('uniforme')}
                className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] transition-colors"
              >
                <Shirt className="mr-2 h-5 w-5" />
                Solicitar Uniforme
              </Button>
            </SheetTrigger>
            <SheetTrigger asChild>
              <Button 
                onClick={() => handleOpenSheet('ferias')}
                className="w-full bg-[#F97316] hover:bg-[#EA580C] transition-colors"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Solicitar Férias
              </Button>
            </SheetTrigger>
            <SheetTrigger asChild>
              <Button 
                onClick={() => handleOpenSheet('documento')}
                className="w-full bg-[#0EA5E9] hover:bg-[#0284C7] transition-colors"
              >
                <FileText className="mr-2 h-5 w-5" />
                Solicitar Documento
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-[425px]">
              <SheetHeader>
                <SheetTitle>Nova Solicitação</SheetTitle>
                <SheetDescription>
                  Preencha os dados para criar uma nova solicitação
                </SheetDescription>
              </SheetHeader>
              <NovaSolicitacaoForm 
                tipoInicial={tipoSolicitacao}
                onSuccess={() => setIsSheetOpen(false)} 
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <SolicitacoesFiltros
        filtroStatus={filtroStatus}
        setFiltroStatus={setFiltroStatus}
        ordenacao={ordenacao}
        setOrdenacao={setOrdenacao}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : solicitacoesFiltradas.length > 0 ? (
        <div className="grid gap-4">
          {solicitacoesFiltradas.map((solicitacao: any) => (
            <SolicitacaoCard
              key={solicitacao.id}
              id={solicitacao.id}
              tipo={solicitacao.type}
              status={solicitacao.status}
              dataInicio={format(new Date(solicitacao.created_at), 'dd/MM/yyyy')}
              dataFim={solicitacao.end_date}
              observacoes={solicitacao.notes}
              detalhes={formatRequestDetails(solicitacao)}
              icon={getIconForType(solicitacao.type)}
              getStatusColor={getStatusColor}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Você ainda não tem nenhuma solicitação.
          </p>
        </div>
      )}
    </div>
  );
};

export default SolicitacoesDoFuncionario;
