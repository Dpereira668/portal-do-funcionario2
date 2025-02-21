
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { LucideIcon } from "lucide-react";
import SolicitacaoCard from "./SolicitacaoCard";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Solicitacao {
  id: number;
  type: string;
  status: string;
  created_at: string;
  end_date?: string;
  notes: string;
  uniform_type?: string;
  uniform_size?: string;
  uniform_quantity?: number;
  amount?: number;
}

interface ListaSolicitacoesProps {
  solicitacoes: Solicitacao[];
  getIconForType: (type: string) => LucideIcon;
  getStatusColor: (status: string) => string;
  formatRequestDetails: (request: any) => string;
}

const ListaSolicitacoes = ({
  solicitacoes,
  getIconForType,
  getStatusColor,
  formatRequestDetails,
}: ListaSolicitacoesProps) => {
  if (solicitacoes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Você ainda não tem nenhuma solicitação.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[500px] rounded-md border p-4">
      <div className="grid gap-4 pr-4">
        {solicitacoes.map((solicitacao) => (
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
    </ScrollArea>
  );
};

export default ListaSolicitacoes;
