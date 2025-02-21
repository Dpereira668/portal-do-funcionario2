
import { useQuery } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import NovaSolicitacaoForm from "./components/NovaSolicitacaoForm";
import SolicitacoesFiltros from "./components/SolicitacoesFiltros";
import { supabase } from "@/lib/supabase";
import SolicitacaoHeader from "./components/SolicitacaoHeader";
import SolicitacoesBotoes from "./components/SolicitacoesBotoes";
import ListaSolicitacoes from "./components/ListaSolicitacoes";
import { getIconForType, getStatusColor, formatRequestDetails } from "./utils/solicitacoesUtils";

const SolicitacoesDoFuncionario = () => {
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [ordenacao, setOrdenacao] = useState("data");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [tipoSolicitacao, setTipoSolicitacao] = useState("");

  const { data: solicitacoes = [], isLoading } = useQuery({
    queryKey: ['solicitacoes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

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
      <SolicitacaoHeader 
        title="Minhas Solicitações"
        subtitle="Gerencie suas solicitações e acompanhe o status"
      />

      <SolicitacoesBotoes onSolicitacaoClick={handleOpenSheet} />

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
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
      ) : (
        <ListaSolicitacoes 
          solicitacoes={solicitacoesFiltradas}
          getIconForType={getIconForType}
          getStatusColor={getStatusColor}
          formatRequestDetails={formatRequestDetails}
        />
      )}
    </div>
  );
};

export default SolicitacoesDoFuncionario;
