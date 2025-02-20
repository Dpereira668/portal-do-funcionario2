import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell, Calendar, AlertTriangle, Shirt, FileText, Plus, PiggyBank, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { getIconForType, getStatusColor } from "./funcionarios/solicitacoes/utils/solicitacoesUtils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import NovaSolicitacaoForm from "./funcionarios/solicitacoes/components/NovaSolicitacaoForm";
import ListaSolicitacoes from "./funcionarios/solicitacoes/components/ListaSolicitacoes";
import { Link } from "react-router-dom";

const DashboardIndex = () => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tipoSolicitacao, setTipoSolicitacao] = useState("uniforme");

  const { data: requests } = useQuery({
    queryKey: ['requests', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('requests')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      return data || [];
    },
  });

  const { data: vacations } = useQuery({
    queryKey: ['vacation_schedules', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('vacation_schedules')
        .select('*')
        .eq('employee_cpf', user?.id)
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })
        .limit(1);
      return data;
    },
  });

  const { data: punishments } = useQuery({
    queryKey: ['punishments', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('punishments')
        .select('*')
        .eq('employee_id', user?.id)
        .eq('status', 'ativo')
        .order('created_at', { ascending: false });
      return data || [];
    },
  });

  const handleSolicitacaoClick = (tipo: string) => {
    setTipoSolicitacao(tipo);
    setIsDialogOpen(true);
  };

  const handleSolicitacaoSuccess = () => {
    setIsDialogOpen(false);
  };

  const formatRequestDetails = (request: any) => {
    if (request.type === 'uniforme') {
      return `${request.uniform_type} - Tamanho ${request.uniform_size} - ${request.uniform_quantity} unidade(s)`;
    }
    return request.description || request.notes;
  };

  const getTipoSolicitacaoTitle = (tipo: string) => {
    switch (tipo) {
      case 'ferias':
        return 'Nova Solicitação de Férias';
      case 'documento':
        return 'Nova Solicitação de Documento';
      case 'adiantamento':
        return 'Nova Solicitação de Adiantamento';
      case 'uniforme':
      default:
        return 'Nova Solicitação de Uniforme';
    }
  };

  const getTipoSolicitacaoDescription = (tipo: string) => {
    switch (tipo) {
      case 'ferias':
        return 'Preencha os dados para solicitar suas férias';
      case 'documento':
        return 'Preencha os dados para solicitar um documento';
      case 'adiantamento':
        return 'Preencha os dados para solicitar um adiantamento';
      case 'uniforme':
      default:
        return 'Preencha os dados para solicitar seu uniforme';
    }
  };

  const proximasFerias = vacations?.length 
    ? `${format(new Date(vacations[0].start_date), "dd/MM/yyyy")} - ${vacations[0].observation || "Férias confirmadas"}`
    : "Nenhuma férias agendada";

  return (
    <div className="h-full p-4 md:p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary">Minhas Solicitações</h2>
            <p className="text-muted-foreground">Gerencie suas solicitações e acompanhe o status</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => handleSolicitacaoClick('uniforme')}
              className="bg-[#8B5CF6] hover:bg-[#7C3AED] transition-colors flex-1 md:flex-none"
            >
              <Shirt className="mr-2 h-4 w-4" />
              Solicitar Uniforme
            </Button>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-[425px] max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>{getTipoSolicitacaoTitle(tipoSolicitacao)}</DialogTitle>
              <DialogDescription>
                {getTipoSolicitacaoDescription(tipoSolicitacao)}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] px-1">
              <NovaSolicitacaoForm 
                tipoInicial={tipoSolicitacao}
                onSuccess={handleSolicitacaoSuccess} 
              />
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Próximas Férias
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{proximasFerias}</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Punições Ativas
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{punishments?.length || "0"}</div>
              <p className="text-sm text-muted-foreground">
                {punishments?.length ? "Advertências/Suspensões ativas" : "Nenhuma punição ativa"}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Solicitações Pendentes
              </CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {requests?.filter(r => r.status === 'pendente').length || "0"}
              </div>
              <p className="text-sm text-muted-foreground">Aguardando aprovação</p>
            </CardContent>
          </Card>
        </div>

        <div className="md:hidden grid grid-cols-2 gap-3">
          <Button
            onClick={() => handleSolicitacaoClick('ferias')}
            className="w-full bg-[#F97316] hover:bg-[#EA580C] transition-colors"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Solicitar Férias
          </Button>
          <Button
            onClick={() => handleSolicitacaoClick('documento')}
            className="w-full bg-[#0EA5E9] hover:bg-[#0284C7] transition-colors"
          >
            <FileText className="mr-2 h-4 w-4" />
            Solicitar Documento
          </Button>
          <Button
            onClick={() => handleSolicitacaoClick('adiantamento')}
            className="w-full bg-[#10B981] hover:bg-[#059669] transition-colors"
          >
            <PiggyBank className="mr-2 h-4 w-4" />
            Solicitar Adiantamento
          </Button>
          <Button
            asChild
            className="w-full bg-[#6366F1] hover:bg-[#4F46E5] transition-colors"
          >
            <Link to="/funcionario/perfil">
              <User className="mr-2 h-4 w-4" />
              Meu Perfil
            </Link>
          </Button>
        </div>

        <div className="space-y-4">
          {requests && requests.length > 0 ? (
            <ListaSolicitacoes
              solicitacoes={requests}
              getIconForType={getIconForType}
              getStatusColor={getStatusColor}
              formatRequestDetails={formatRequestDetails}
            />
          ) : (
            <Card className="bg-muted/50">
              <CardContent className="flex flex-col items-center justify-center py-6 text-center">
                <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Nenhuma solicitação encontrada
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardIndex;
