
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell, Calendar, AlertTriangle, Shirt, FileText, Plus } from "lucide-react";
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
import { useState } from "react";
import NovaSolicitacaoForm from "./funcionarios/solicitacoes/components/NovaSolicitacaoForm";
import ListaSolicitacoes from "./funcionarios/solicitacoes/components/ListaSolicitacoes";

const DashboardIndex = () => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handleSolicitacaoSuccess = () => {
    setIsDialogOpen(false);
  };

  const formatRequestDetails = (request: any) => {
    if (request.type === 'uniforme') {
      return `${request.uniform_type} - Tamanho ${request.uniform_size} - ${request.uniform_quantity} unidade(s)`;
    }
    return request.description || request.notes;
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
              onClick={() => setIsDialogOpen(true)}
              className="bg-[#8B5CF6] hover:bg-[#7C3AED] transition-colors flex-1 md:flex-none"
            >
              <Shirt className="mr-2 h-4 w-4" />
              Solicitar Uniforme
            </Button>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nova Solicitação de Uniforme</DialogTitle>
              <DialogDescription>
                Preencha os dados para solicitar seu uniforme
              </DialogDescription>
            </DialogHeader>
            <NovaSolicitacaoForm 
              tipoInicial="uniforme"
              onSuccess={handleSolicitacaoSuccess} 
            />
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
