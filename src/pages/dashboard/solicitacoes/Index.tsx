import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Coffee, Shirt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const SolicitacoesIndex = () => {
  const { toast } = useToast();
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

  const handleAction = (id: number, action: 'aprovar' | 'rejeitar') => {
    const solicitacao = solicitacoes.find(s => s.id === id);
    if (!solicitacao) return;

    const message = action === 'aprovar' 
      ? `Solicitação de ${solicitacao.tipo.toLowerCase()} aprovada para ${solicitacao.funcionario}`
      : `Solicitação de ${solicitacao.tipo.toLowerCase()} rejeitada para ${solicitacao.funcionario}`;

    toast({
      title: `${action === 'aprovar' ? 'Aprovação' : 'Rejeição'} de solicitação`,
      description: message,
      variant: action === 'aprovar' ? 'default' : 'destructive',
    });
  };

  const handleConfirmDelivery = async (id: number) => {
    const solicitacao = solicitacoes.find(s => s.id === id);
    if (!solicitacao) return;

    try {
      const { data: updatedRequest, error } = await supabase
        .from('requests')
        .update({
          delivery_status: 'entregue',
          delivery_date: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Entrega confirmada",
        description: `A entrega do uniforme para ${solicitacao.funcionario} foi confirmada com sucesso.`,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao confirmar entrega",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-primary">Solicitações</h2>
          <p className="text-muted-foreground">
            Gerencie as solicitações dos funcionários
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {solicitacoes.map((solicitacao) => (
          <Card 
            key={solicitacao.id} 
            className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/5 rounded-full group-hover:bg-primary/10 transition-colors">
                  <solicitacao.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-medium">
                    {solicitacao.tipo}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {solicitacao.funcionario} - {solicitacao.data}
                  </p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${getStatusColor(
                  solicitacao.status
                )}`}
              >
                {solicitacao.status}
              </span>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {solicitacao.detalhes}
              </p>
              {solicitacao.status === "Pendente" && (
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:bg-red-50 transition-colors"
                    onClick={() => handleAction(solicitacao.id, 'rejeitar')}
                  >
                    Rejeitar
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700 transition-colors"
                    onClick={() => handleAction(solicitacao.id, 'aprovar')}
                  >
                    Aprovar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SolicitacoesIndex;
