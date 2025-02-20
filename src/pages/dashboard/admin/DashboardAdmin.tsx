
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  Plus,
  FileText,
  Calendar,
  UserX,
  AlertTriangle,
  Building2,
  Shirt,
  ScrollText,
  PiggyBank,
} from "lucide-react";

const DashboardAdmin = () => {
  const navigate = useNavigate();

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-primary">
                Gerenciamento Administrativo
              </h2>
              <p className="text-muted-foreground">
                Gerencie todos os aspectos da empresa
              </p>
            </div>
            
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  className="pl-8 w-[250px]"
                />
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Ação
              </Button>
            </div>
          </div>

          <Tabs defaultValue="funcionarios" className="space-y-4">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="funcionarios" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Funcionários
              </TabsTrigger>
              <TabsTrigger value="documentos" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Documentos
              </TabsTrigger>
              <TabsTrigger value="ferias" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Férias
              </TabsTrigger>
              <TabsTrigger value="faltas" className="flex items-center gap-2">
                <UserX className="h-4 w-4" />
                Faltas
              </TabsTrigger>
              <TabsTrigger value="punicoes" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Punições
              </TabsTrigger>
              <TabsTrigger value="unidades" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Unidades
              </TabsTrigger>
              <TabsTrigger value="uniformes" className="flex items-center gap-2">
                <Shirt className="h-4 w-4" />
                Uniformes
              </TabsTrigger>
              <TabsTrigger value="relatorios" className="flex items-center gap-2">
                <ScrollText className="h-4 w-4" />
                Relatórios
              </TabsTrigger>
              <TabsTrigger value="financeiro" className="flex items-center gap-2">
                <PiggyBank className="h-4 w-4" />
                Financeiro
              </TabsTrigger>
            </TabsList>

            <TabsContent value="funcionarios" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/admin/gestao-funcionarios')}>
                  <CardHeader>
                    <CardTitle>Gestão de Funcionários</CardTitle>
                    <CardDescription>
                      Cadastre e gerencie funcionários
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="secondary" className="w-full">
                      Acessar Gestão
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all cursor-pointer">
                  <CardHeader>
                    <CardTitle>Cargos e Funções</CardTitle>
                    <CardDescription>
                      Gerencie cargos e atribuições
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="secondary" className="w-full">
                      Gerenciar Cargos
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all cursor-pointer">
                  <CardHeader>
                    <CardTitle>Departamentos</CardTitle>
                    <CardDescription>
                      Organize a estrutura organizacional
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="secondary" className="w-full">
                      Ver Departamentos
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="documentos" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="hover:shadow-lg transition-all cursor-pointer">
                  <CardHeader>
                    <CardTitle>Documentos Pendentes</CardTitle>
                    <CardDescription>
                      Visualize e aprove documentos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="secondary" className="w-full">
                      Ver Pendências
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all cursor-pointer">
                  <CardHeader>
                    <CardTitle>Emitir Documentos</CardTitle>
                    <CardDescription>
                      Gere documentos oficiais
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="secondary" className="w-full">
                      Novo Documento
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all cursor-pointer">
                  <CardHeader>
                    <CardTitle>Arquivo</CardTitle>
                    <CardDescription>
                      Acesse documentos arquivados
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="secondary" className="w-full">
                      Ver Arquivo
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="ferias" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/admin/gestao-ferias')}>
                  <CardHeader>
                    <CardTitle>Calendário de Férias</CardTitle>
                    <CardDescription>
                      Visualize e gerencie férias
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="secondary" className="w-full">
                      Ver Calendário
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all cursor-pointer">
                  <CardHeader>
                    <CardTitle>Solicitações</CardTitle>
                    <CardDescription>
                      Aprove pedidos de férias
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="secondary" className="w-full">
                      Ver Solicitações
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all cursor-pointer">
                  <CardHeader>
                    <CardTitle>Relatórios</CardTitle>
                    <CardDescription>
                      Gere relatórios de férias
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="secondary" className="w-full">
                      Gerar Relatório
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="faltas" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/admin/lancamento-faltas')}>
                  <CardHeader>
                    <CardTitle>Lançar Faltas</CardTitle>
                    <CardDescription>
                      Registre faltas e ausências
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="secondary" className="w-full">
                      Novo Registro
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all cursor-pointer">
                  <CardHeader>
                    <CardTitle>Justificativas</CardTitle>
                    <CardDescription>
                      Analise justificativas de faltas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="secondary" className="w-full">
                      Ver Justificativas
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all cursor-pointer">
                  <CardHeader>
                    <CardTitle>Histórico</CardTitle>
                    <CardDescription>
                      Consulte histórico de faltas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="secondary" className="w-full">
                      Ver Histórico
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="punicoes" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/admin/punicoes')}>
                  <CardHeader>
                    <CardTitle>Advertências</CardTitle>
                    <CardDescription>
                      Gerencie advertências
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="secondary" className="w-full">
                      Ver Advertências
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all cursor-pointer">
                  <CardHeader>
                    <CardTitle>Suspensões</CardTitle>
                    <CardDescription>
                      Gerencie suspensões
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="secondary" className="w-full">
                      Ver Suspensões
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all cursor-pointer">
                  <CardHeader>
                    <CardTitle>Processos</CardTitle>
                    <CardDescription>
                      Acompanhe processos disciplinares
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="secondary" className="w-full">
                      Ver Processos
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Outros TabsContent seguem o mesmo padrão */}
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
};

export default DashboardAdmin;
