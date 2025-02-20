import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell, Calendar, AlertTriangle, Shirt, FileText, PiggyBank, Plus } from "lucide-react";
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

  const pendingRequests = requests?.filter(r => r.status === 'pendente') || [];

  const stats = [
    {
      title: "Solicitações Pendentes",
      value: pendingRequests.length || "0",
      icon: <Bell className="h-4 w-4 text-muted-foreground" />,
      description: "Aguardando aprovação",
    },
    {
      title: "Punições Ativas",
      value: punishments?.length || "0",
      icon: <AlertTriangle className="h-4 w-4 text-muted-foreground" />,
      description: "Advertências e Suspensões",
    },
    {
      title: "Férias Agendadas",
      value: vacations?.length ? format(new Date(vacations[0].start_date), "dd/MM/yyyy") : "Não agendado",
      icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
      description: vacations?.length ? `${vacations[0].observation || "Férias confirmadas"}` : "Nenhuma férias agendada",
    },
    {
      title: "Uniformes Solicitados",
      value: requests?.filter(r => r.type === 'uniforme' && r.status === 'pendente').length || "0",
      icon: <Shirt className="h-4 w-4 text-muted-foreground" />,
      description: "Pedidos em andamento",
    },
  ];

  const handleSolicitacaoSuccess = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="h-full p-4 md:p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary">Dashboard</h2>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="bg-[#8B5CF6] hover:bg-[#7C3AED] transition-colors"
          >
            <Shirt className="mr-2 h-4 w-4" />
            Solicitar Uniforme
          </Button>
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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-primary">Minhas Solicitações</h3>
          <div className="space-y-4">
            {requests?.slice(0, 5).map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/5 rounded-full">
                      {getIconForType(request.type) && 
                        <request.icon className="h-4 w-4 text-primary" />
                      }
                    </div>
                    <div>
                      <CardTitle className="text-sm font-medium capitalize">
                        {request.type}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(request.created_at), "dd/MM/yyyy")}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      request.status
                    )}`}
                  >
                    {request.status}
                  </span>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {request.description || request.notes}
                  </p>
                </CardContent>
              </Card>
            ))}
            {requests?.length === 0 && (
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
    </div>
  );
};

export default DashboardIndex;
