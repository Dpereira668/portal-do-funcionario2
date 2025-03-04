import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Coffee, Shirt, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { ScrollArea } from "@/components/ui/scroll-area";

const SolicitacoesIndex = () => {
  const { toast } = useToast();
  const [mostrarRespondidas, setMostrarRespondidas] = useState(false);

  const solicitacoes = [
    {
      id: 1,
      tipo: "Uniforme",
      status: "Pendente",
      data: "15/04/2024",
      funcionario: "João Silva",
      detalhes: "Camisa social - Tamanho M - 2 unidades",
      icon: Shirt,
    },
    {
      id: 2,
      tipo: "Férias",
      status: "Pendente",
      data: "12/04/2024",
      funcionario: "Maria Santos",
      detalhes: "Período: 15/05/2024 a 30/05/2024",
      icon: Calendar,
    },
    {
      id: 3,
      tipo: "Documento",
      status: "Aprovado",
      data: "10/04/2024",
      funcionario: "Pedro Souza",
      detalhes: "Declaração de vínculo empregatício",
      icon: FileText,
    },
    {
      id: 4,
      tipo: "Outros",
      status: "Rejeitado",
      data: "08/04/2024",
      funcionario: "Ana Oliveira",
      detalhes: "Solicitação de mudança de horário",
      icon: Coffee,
    },
  ];

  const solicitacoesFiltradas = mostrarRespondidas
    ? solicitacoes.filter((s) => s.status !== "Pendente")
    : solicitacoes;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovado":
        return "text-green-600";
      case "Rejeitado":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  const handleAction = (id: number, action: 'aprovar' | 'rejeitar') => {
    const solicitacao = solicitacoes.find(s => s.id === id);
    if (!solicitacao) return;

    try {
      const message = action === 'aprovar' 
        ? `Solicitação de ${solicitacao.tipo.toLowerCase()} aprovada para ${solicitacao.funcionario}`
        : `Solicitação de ${solicitacao.tipo.toLowerCase()} rejeitada para ${solicitacao.funcionario}`;

      toast({
        title: `${action === 'aprovar' ? 'Aprovação' : 'Rejeição'} de solicitação`,
        description: message,
        variant: action === 'aprovar' ? 'default' : 'destructive',
      });
    } catch (error: any) {
      console.error(`Erro ao ${action} solicitação:`, error);
      toast({
        title: `Erro ao ${action} solicitação`,
        description: error.message || `Ocorreu um erro ao ${action} a solicitação. Tente novamente.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="p-6 space-y-6 flex-1 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-primary">Solicitações</h2>
            <p className="text-muted-foreground">
              Gerencie as solicitações dos funcionários
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setMostrarRespondidas(!mostrarRespondidas)}
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            {mostrarRespondidas ? "Todas as solicitações" : "Solicitações respondidas"}
          </Button>
        </div>

        <div className="border rounded-lg overflow-hidden h-[calc(100vh-12rem)]">
          <ScrollArea className="h-full">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
                <TableRow>
                  <TableHead className="w-[200px]">Tipo</TableHead>
                  <TableHead className="w-[200px]">Funcionário</TableHead>
                  <TableHead className="w-[120px]">Data</TableHead>
                  <TableHead className="min-w-[300px]">Detalhes</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[200px] text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {solicitacoesFiltradas.map((solicitacao) => (
                  <TableRow key={solicitacao.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <solicitacao.icon className="h-4 w-4 text-primary" />
                        {solicitacao.tipo}
                      </div>
                    </TableCell>
                    <TableCell>{solicitacao.funcionario}</TableCell>
                    <TableCell>{solicitacao.data}</TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      {solicitacao.detalhes}
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${getStatusColor(solicitacao.status)}`}>
                        {solicitacao.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {solicitacao.status === "Pendente" && (
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => handleAction(solicitacao.id, 'rejeitar')}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Rejeitar
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleAction(solicitacao.id, 'aprovar')}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Aprovar
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default SolicitacoesIndex;
