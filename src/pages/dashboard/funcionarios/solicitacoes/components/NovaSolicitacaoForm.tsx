
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, IdCard, UserCog, MapPin, Mail } from "lucide-react";
import UniformeForm from "./UniformeForm";
import DatasForm from "./DatasForm";
import AdiantamentoForm from "./AdiantamentoForm";
import { useSolicitacaoForm } from "../hooks/useSolicitacaoForm";
import { useState } from "react";

interface NovaSolicitacaoFormProps {
  onSuccess: () => void;
  tipoInicial?: string;
}

const NovaSolicitacaoForm = ({ onSuccess, tipoInicial }: NovaSolicitacaoFormProps) => {
  const { novaSolicitacao, loading, handleChange, handleSubmit } = useSolicitacaoForm({
    onSuccess,
    tipoInicial,
  });

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    funcao: "",
    posto: "",
    email: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <ScrollArea className="h-[calc(100vh-200px)] pr-4">
        <div className="space-y-4">
          <Card className="p-4">
            <CardContent className="space-y-4 p-0">
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
                    required
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
                    required
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
                    required
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
                    required
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
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {novaSolicitacao.tipo === "uniforme" && (
            <UniformeForm
              itens={novaSolicitacao.uniformeItens}
              onChange={(novoItens) => handleChange("uniformeItens", novoItens)}
            />
          )}

          {(novaSolicitacao.tipo === "ferias" || novaSolicitacao.tipo === "documento") && (
            <DatasForm
              tipo={novaSolicitacao.tipo}
              dataInicio={novaSolicitacao.dataInicio}
              dataFim={novaSolicitacao.dataFim}
              onChange={handleChange}
            />
          )}

          {novaSolicitacao.tipo === "adiantamento" && (
            <AdiantamentoForm
              valor={novaSolicitacao.advance_amount}
              motivo={novaSolicitacao.advance_reason}
              onChange={handleChange}
            />
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Observações</label>
            <textarea
              className="w-full p-2 border rounded-md min-h-[100px]"
              value={novaSolicitacao.observacoes}
              onChange={(e) => handleChange("observacoes", e.target.value)}
              placeholder="Adicione observações importantes sobre sua solicitação..."
            />
          </div>
        </div>
      </ScrollArea>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
        ) : (
          "Enviar Solicitação"
        )}
      </Button>
    </form>
  );
};

export default NovaSolicitacaoForm;
