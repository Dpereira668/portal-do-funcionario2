
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Home, Users, Calendar, UserX, AlertTriangle } from "lucide-react";
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

  const { data: activeVacations } = useQuery({
    queryKey: ['active_vacations'],
    queryFn: async () => {
      const today = new Date().toISOString();
      const { data } = await supabase
        .from('vacation_schedules')
        .select('*')
        .lte('start_date', today)
        .gte('end_date', today);
      return data || [];
    },
  });

  const { data: absences } = useQuery({
    queryKey: ['absences'],
    queryFn: async () => {
      const { data } = await supabase
        .from('absences')
        .select('*')
        .eq('status', 'pending')
        .order('absence_date', { ascending: false });
      return data || [];
    },
  });

  return (
    <div className="h-full p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-primary">Dashboard Administrativo</h2>
          <p className="text-muted-foreground">
            Gerencie faltas, férias e solicitações dos funcionários
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Férias Ativas
              </CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeVacations?.length || "0"}</div>
              <p className="text-sm text-muted-foreground">
                Funcionários em férias
              </p>
              <Button asChild className="w-full mt-4" variant="outline">
                <Link to="/admin/gestao-ferias">Gerenciar Férias</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Faltas Pendentes
              </CardTitle>
              <UserX className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{absences?.length || "0"}</div>
              <p className="text-sm text-muted-foreground">
                Faltas para análise
              </p>
              <Button asChild className="w-full mt-4" variant="outline">
                <Link to="/admin/lancamento-faltas">Gerenciar Faltas</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Solicitações Pendentes
              </CardTitle>
              <Bell className="h-4 w-4 text-yellow-600" />
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
                Gestão de Funcionários
              </CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Gerenciar funcionários
              </p>
              <Button asChild className="w-full" variant="outline">
                <Link to="/admin/gestao-funcionarios">Ver Funcionários</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Funcionários em Férias</CardTitle>
              <CardDescription>
                Funcionários atualmente em período de férias
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeVacations?.slice(0, 5).map((vacation: any) => (
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
              {(!activeVacations || activeVacations.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum funcionário em férias
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Últimas Faltas</CardTitle>
              <CardDescription>
                Faltas mais recentes registradas no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {absences?.slice(0, 5).map((absence: any) => (
                <div
                  key={absence.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium">{absence.employee_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(absence.absence_date).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="ghost" asChild>
                    <Link to={`/admin/lancamento-faltas`}>Ver</Link>
                  </Button>
                </div>
              ))}
              {(!absences || absences.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma falta registrada
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
