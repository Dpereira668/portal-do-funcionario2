
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

  const menuItems = [
    {
      title: "Gestão de Funcionários",
      description: "Cadastro, edição e visualização de funcionários",
      icon: Users,
      path: "/admin/gestao-funcionarios",
      color: "bg-blue-50 hover:bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Gestão de Férias",
      description: "Planejamento e aprovação de férias",
      icon: CalendarRange,
      path: "/admin/gestao-ferias",
      color: "bg-green-50 hover:bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Lançamento de Faltas",
      description: "Registro e controle de ausências",
      icon: UserX,
      path: "/admin/lancamento-faltas",
      color: "bg-purple-50 hover:bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Punições",
      description: "Advertências e suspensões",
      icon: AlertTriangle,
      path: "/admin/punicoes",
      color: "bg-red-50 hover:bg-red-100",
      iconColor: "text-red-600",
    },
    {
      title: "Solicitações",
      description: "Aprovação de requerimentos",
      icon: Bell,
      path: "/admin/solicitacoes",
      color: "bg-amber-50 hover:bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      title: "Documentos",
      description: "Emissão de documentos oficiais",
      icon: FileText,
      path: "/admin/documentos",
      color: "bg-indigo-50 hover:bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      title: "Cargos e Funções",
      description: "Gestão de cargos e atribuições",
      icon: UserCog,
      path: "/admin/cargos",
      color: "bg-cyan-50 hover:bg-cyan-100",
      iconColor: "text-cyan-600",
    },
    {
      title: "Unidades",
      description: "Gestão de locais de trabalho",
      icon: Building2,
      path: "/admin/unidades",
      color: "bg-emerald-50 hover:bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "Uniformes",
      description: "Controle de uniformes e EPIs",
      icon: Shirt,
      path: "/admin/uniformes",
      color: "bg-violet-50 hover:bg-violet-100",
      iconColor: "text-violet-600",
    },
    {
      title: "Dúvidas Frequentes",
      description: "Central de ajuda e suporte",
      icon: BadgeHelp,
      path: "/admin/faq",
      color: "bg-rose-50 hover:bg-rose-100",
      iconColor: "text-rose-600",
    },
    {
      title: "Relatórios",
      description: "Geração de relatórios gerenciais",
      icon: ScrollText,
      path: "/admin/relatorios",
      color: "bg-teal-50 hover:bg-teal-100",
      iconColor: "text-teal-600",
    },
    {
      title: "Financeiro",
      description: "Adiantamentos e reembolsos",
      icon: PiggyBank,
      path: "/admin/financeiro",
      color: "bg-orange-50 hover:bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-primary">
          Painel Administrativo
        </h2>
        <p className="text-muted-foreground">
          Acesse todas as funcionalidades administrativas do sistema
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {menuItems.map((item) => (
          <Card 
            key={item.title}
            className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${item.color} border-none`}
            onClick={() => navigate(item.path)}
          >
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/50 rounded-lg group-hover:bg-white/80 transition-colors">
                  <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                </div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600">
                {item.description}
              </CardDescription>
              <Button 
                variant="ghost" 
                className="w-full mt-4 bg-white/50 hover:bg-white/80 transition-colors"
              >
                Acessar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardAdmin;
