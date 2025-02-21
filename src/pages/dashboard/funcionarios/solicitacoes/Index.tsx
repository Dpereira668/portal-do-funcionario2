
import { useQuery } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import NovaSolicitacaoForm from "./components/NovaSolicitacaoForm";
import SolicitacoesFiltros from "./components/SolicitacoesFiltros";
import { supabase } from "@/lib/supabase";
import SolicitacaoHeader from "./components/SolicitacaoHeader";
import SolicitacoesBotoes from "./components/SolicitacoesBotoes";
import ListaSolicitacoes from "./components/ListaSolicitacoes";
import { getIconForType, getStatusColor, formatRequestDetails } from "./utils/solicitacoesUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, IdCard, UserCog, MapPin, Mail } from "lucide-react";

const SolicitacoesDoFuncionario = () => {
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [ordenacao, setOrdenacao] = useState("data");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [tipoSolicitacao, setTipoSolicitacao] = useState("");
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    funcao: "",
    posto: "",
    email: "",
  });

  const { data: solicitacoes = [], isLoading } = useQuery({
    queryKey: ['solicitacoes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const handleOpenSheet = (tipo: string) => {
    setTipoSolicitacao(tipo);
    setIsSheetOpen(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const solicitacoesFiltradas = solicitacoes
    .filter((sol: any) => filtroStatus === "todos" || sol.status === filtroStatus)
    .sort((a: any, b: any) => {
      if (ordenacao === "data") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return a.status.localeCompare(b.status);
    });

  return (
    <div className="p-8 space-y-6">
      <SolicitacaoHeader 
        title="Minhas Solicitações"
        subtitle="Gerencie suas solicitações e acompanhe o status"
      />

      <Card className="p-6">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <div className="relative">
              <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="nome"
                placeholder="Seu nome completo"
                className="pl-8"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <div className="relative">
              <IdCard className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="cpf"
                placeholder="000.000.000-00"
                className="pl-8"
                value={formData.cpf}
                onChange={(e) => handleInputChange('cpf', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="funcao">Função</Label>
            <div className="relative">
              <UserCog className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="funcao"
                placeholder="Sua função"
                className="pl-8"
                value={formData.funcao}
                onChange={(e) => handleInputChange('funcao', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="posto">Posto</Label>
            <div className="relative">
              <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="posto"
                placeholder="Seu posto"
                className="pl-8"
                value={formData.posto}
                onChange={(e) => handleInputChange('posto', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="seu.email@exemplo.com"
                className="pl-8"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <SolicitacoesBotoes onSolicitacaoClick={handleOpenSheet} />

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-[425px]">
          <SheetHeader>
            <SheetTitle>Nova Solicitação</SheetTitle>
            <SheetDescription>
              Preencha os dados para criar uma nova solicitação
            </SheetDescription>
          </SheetHeader>
          <NovaSolicitacaoForm 
            tipoInicial={tipoSolicitacao}
            onSuccess={() => setIsSheetOpen(false)} 
          />
        </SheetContent>
      </Sheet>

      <SolicitacoesFiltros
        filtroStatus={filtroStatus}
        setFiltroStatus={setFiltroStatus}
        ordenacao={ordenacao}
        setOrdenacao={setOrdenacao}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <ListaSolicitacoes 
          solicitacoes={solicitacoesFiltradas}
          getIconForType={getIconForType}
          getStatusColor={getStatusColor}
          formatRequestDetails={formatRequestDetails}
        />
      )}
    </div>
  );
};

export default SolicitacoesDoFuncionario;
