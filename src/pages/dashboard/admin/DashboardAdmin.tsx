
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  CalendarRange,
  UserX,
  AlertTriangle,
  Bell,
  FileText,
  UserCog,
  Building2,
  Shirt,
  BadgeHelp,
  ScrollText,
  PiggyBank,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardAdmin = () => {
  const navigate = useNavigate();

  const administrativeItems = [
    {
      title: "Gestão de Funcionários",
      icon: Users,
      path: "/admin/gestao-funcionarios",
      color: "bg-blue-500",
      count: 124,
    },
    {
      title: "Faltas",
      icon: UserX,
      path: "/admin/lancamento-faltas",
      color: "bg-red-500",
      count: 8,
    },
    {
      title: "Férias",
      icon: CalendarRange,
      path: "/admin/gestao-ferias",
      color: "bg-green-500",
      count: 12,
    },
    {
      title: "Punições",
      icon: AlertTriangle,
      path: "/admin/punicoes",
      color: "bg-amber-500",
      count: 3,
    },
  ];

  const requestsItems = [
    {
      title: "Solicitações Pendentes",
      icon: Bell,
      path: "/admin/solicitacoes",
      color: "bg-purple-500",
      count: 15,
    },
    {
      title: "Documentos",
      icon: FileText,
      path: "/admin/documentos",
      color: "bg-indigo-500",
      count: 27,
    },
  ];

  const managementItems = [
    {
      title: "Cargos",
      icon: UserCog,
      path: "/admin/cargos",
      color: "bg-cyan-500",
      count: 32,
    },
    {
      title: "Unidades",
      icon: Building2,
      path: "/admin/unidades",
      color: "bg-teal-500",
      count: 8,
    },
    {
      title: "Uniformes",
      icon: Shirt,
      path: "/admin/uniformes",
      color: "bg-emerald-500",
      count: 45,
    },
  ];

  const otherItems = [
    {
      title: "Relatórios",
      icon: ScrollText,
      path: "/admin/relatorios",
      color: "bg-rose-500",
      count: null,
    },
    {
      title: "Financeiro",
      icon: PiggyBank,
      path: "/admin/financeiro",
      color: "bg-orange-500",
      count: null,
    },
    {
      title: "Ajuda",
      icon: BadgeHelp,
      path: "/admin/faq",
      color: "bg-slate-500",
      count: null,
    },
  ];

  const renderCard = (item: any) => (
    <Card 
      key={item.title}
      className="group cursor-pointer hover:shadow-lg transition-all duration-300"
      onClick={() => navigate(item.path)}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {item.title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${item.color}`}>
          <item.icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {item.count !== null ? item.count : "-"}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Visão geral do sistema administrativo
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-4 text-muted-foreground">
            Gestão de Pessoal
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {administrativeItems.map(renderCard)}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4 text-muted-foreground">
            Solicitações e Documentos
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {requestsItems.map(renderCard)}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4 text-muted-foreground">
            Gestão Organizacional
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            {managementItems.map(renderCard)}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4 text-muted-foreground">
            Outras Funcionalidades
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            {otherItems.map(renderCard)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
