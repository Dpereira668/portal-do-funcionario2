
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell, Calendar, AlertTriangle, Shirt } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

const DashboardIndex = () => {
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

  const stats = [
    {
      title: "Solicitações Pendentes",
      value: requests?.length || "0",
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
      value: requests?.filter(r => r.type === 'uniforme').length || "0",
      icon: <Shirt className="h-4 w-4 text-muted-foreground" />,
      description: "Pedidos em andamento",
    },
  ];

  return (
    <div className="h-full p-4 md:p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold text-primary">Dashboard</h2>
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
      </div>
    </div>
  );
};

export default DashboardIndex;
