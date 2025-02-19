
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell, Calendar, User, Users, AlertTriangle } from "lucide-react";

const DashboardIndex = () => {
  const stats = [
    {
      title: "Solicitações Pendentes",
      value: "12",
      icon: <Bell className="h-4 w-4 text-muted-foreground" />,
      description: "Aguardando aprovação",
    },
    {
      title: "Funcionários",
      value: "48",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      description: "Ativos no sistema",
    },
    {
      title: "Férias Agendadas",
      value: "8",
      icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
      description: "Próximos 30 dias",
    },
    {
      title: "Punições Ativas",
      value: "3",
      icon: <AlertTriangle className="h-4 w-4 text-muted-foreground" />,
      description: "Advertências e Suspensões",
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
