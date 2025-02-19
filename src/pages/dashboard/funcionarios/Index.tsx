
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, Bell, Calendar, ScrollText, UserX } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

const FuncionariosIndex = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: requests } = useQuery({
    queryKey: ['requests', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('requests')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'pendente')
        .order('created_at', { ascending: false });
      return data || [];
    },
  });

  const { data: punishments } = useQuery({
    queryKey: ['punishments', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('punishments')
        .select('*')
        .eq('employee_id', user?.id)
        .order('created_at', { ascending: false });
      return data || [];
    },
  });

  const { data: absences } = useQuery({
    queryKey: ['absences', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('absences')
        .select('*')
        .eq('employee_cpf', user?.id)
        .order('absence_date', { ascending: false });
      return data || [];
    },
  });

  const { data: vacations } = useQuery({
    queryKey: ['vacations', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('vacation_schedules')
        .select('*')
        .eq('employee_cpf', user?.id)
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true });
      return data || [];
    },
  });

  const cards = [
    {
      title: "Solicitações Pendentes",
      value: requests?.length || 0,
      description: "Aguardando resposta",
      icon: <Bell className="h-5 w-5 text-orange-500" />,
      onClick: () => navigate("/funcionario/solicitacoes"),
      color: "bg-orange-50",
      link: "Ver todas",
    },
    {
      title: "Punições Ativas",
      value: punishments?.length || 0,
      description: "Advertências e suspensões",
      icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
      onClick: () => navigate("/funcionario/punicoes"),
      color: "bg-red-50",
      link: "Detalhes",
    },
    {
      title: "Faltas Registradas",
      value: absences?.length || 0,
      description: "Últimos 30 dias",
      icon: <UserX className="h-5 w-5 text-purple-500" />,
      onClick: () => navigate("/funcionario/faltas"),
      color: "bg-purple-50",
      link: "Ver histórico",
    },
    {
      title: "Próximas Férias",
      value: vacations?.length ? format(new Date(vacations[0].start_date), "dd/MM/yyyy") : "Não agendado",
      description: vacations?.length ? `${vacations[0].observation || "Férias agendadas"}` : "Nenhuma férias agendada",
      icon: <Calendar className="h-5 w-5 text-blue-500" />,
      onClick: () => navigate("/funcionario/ferias"),
      color: "bg-blue-50",
      link: "Ver agenda",
    },
  ];

  const quickActions = [
    {
      title: "Nova Solicitação",
      description: "Uniformes, documentos e outros",
      icon: <ScrollText className="h-5 w-5" />,
      onClick: () => navigate("/funcionario/solicitacoes"),
      colorClass: "bg-primary text-primary-foreground hover:bg-primary/90",
    },
    {
      title: "Solicitar Férias",
      description: "Agende suas próximas férias",
      icon: <Calendar className="h-5 w-5" />,
      onClick: () => navigate("/funcionario/solicitacoes"),
      colorClass: "bg-[#F97316] text-white hover:bg-[#EA580C]",
    },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-primary">Meu Dashboard</h2>
        <p className="text-muted-foreground">
          Acompanhe suas informações e faça solicitações
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <Card 
            key={index} 
            className={`${card.color} border-none cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg`}
            onClick={card.onClick}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                {card.icon}
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-xs hover:bg-white/20"
                >
                  {card.link}
                </Button>
              </div>
              <CardTitle className="text-lg font-semibold mt-2">
                {card.title}
              </CardTitle>
              <CardDescription>
                {card.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {card.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {quickActions.map((action, index) => (
          <Button
            key={index}
            className={`w-full h-auto p-4 ${action.colorClass}`}
            onClick={action.onClick}
          >
            <div className="flex items-start text-left gap-4">
              <div className="mt-1">{action.icon}</div>
              <div>
                <h3 className="font-semibold text-lg">{action.title}</h3>
                <p className="text-sm opacity-90">{action.description}</p>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FuncionariosIndex;
