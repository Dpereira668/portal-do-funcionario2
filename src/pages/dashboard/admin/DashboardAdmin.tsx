
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, UserPlus, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";

const DashboardAdmin = () => {
  const { data: pendingRequests } = useQuery({
    queryKey: ['pending_requests'],
    queryFn: async () => {
      const { data } = await supabase
        .from('requests')
        .select('*')
        .eq('status', 'pendente')
        .order('created_at', { ascending: false });
      return data || [];
    },
  });

  const { data: registrationRequests } = useQuery({
    queryKey: ['registration_requests'],
    queryFn: async () => {
      const { data } = await supabase
        .from('registration_requests')
        .select('*')
        .eq('status', 'pending');
      return data || [];
    },
  });

  const { data: vacationRequests } = useQuery({
    queryKey: ['vacation_schedules'],
    queryFn: async () => {
      const { data } = await supabase
        .from('vacation_schedules')
        .select('*')
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true });
      return data || [];
    },
  });

  return (
    <div className="h-full p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-primary">Dashboard Administrativo</h2>
          <p className="text-muted-foreground">
            Gerencie solicitações, cadastros e férias dos funcionários
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Solicitações Pendentes
              </CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRequests?.length || "0"}</div>
              <p className="text-sm text-muted-foreground">
                Aguardando aprovação
              </p>
              <Button asChild className="w-full mt-4" variant="outline">
                <Link to="/admin/solicitacoes">Ver Solicitações</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Solicitações de Cadastro
              </CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{registrationRequests?.length || "0"}</div>
              <p className="text-sm text-muted-foreground">
                Novos cadastros pendentes
              </p>
              <Button asChild className="w-full mt-4" variant="outline">
                <Link to="/admin/gestao-funcionarios">Gerenciar Cadastros</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Solicitações de Férias
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vacationRequests?.length || "0"}</div>
              <p className="text-sm text-muted-foreground">
                Férias para análise
              </p>
              <Button asChild className="w-full mt-4" variant="outline">
                <Link to="/admin/gestao-ferias">Gerenciar Férias</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Perfil Administrativo
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Gerencie suas informações
              </p>
              <Button asChild className="w-full" variant="outline">
                <Link to="/admin/perfil">Ver Perfil</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Últimas Solicitações Pendentes</CardTitle>
              <CardDescription>
                Solicitações mais recentes que precisam de sua atenção
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingRequests?.slice(0, 5).map((request: any) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium">{request.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(request.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="ghost" asChild>
                    <Link to={`/admin/solicitacoes`}>Ver</Link>
                  </Button>
                </div>
              ))}
              {(!pendingRequests || pendingRequests.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma solicitação pendente
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Próximas Férias</CardTitle>
              <CardDescription>
                Períodos de férias aprovados para os próximos dias
              </CardDescription>
            </CardHeader>
            <CardContent>
              {vacationRequests?.slice(0, 5).map((vacation: any) => (
                <div
                  key={vacation.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium">{vacation.employee_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(vacation.start_date).toLocaleDateString()} - {new Date(vacation.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="ghost" asChild>
                    <Link to={`/admin/gestao-ferias`}>Ver</Link>
                  </Button>
                </div>
              ))}
              {(!vacationRequests || vacationRequests.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma férias agendada
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
