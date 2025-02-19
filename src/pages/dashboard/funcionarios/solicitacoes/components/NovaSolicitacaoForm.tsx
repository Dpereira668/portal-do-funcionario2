
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

interface NovaSolicitacaoFormProps {
  onSuccess: () => void;
}

const NovaSolicitacaoForm = ({ onSuccess }: NovaSolicitacaoFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [novaSolicitacao, setNovaSolicitacao] = useState({
    tipo: "",
    dataInicio: "",
    dataFim: "",
    observacoes: "",
    tamanhoUniforme: "",
    tipoUniforme: "",
    quantidade: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erro na solicitação",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return;
    }

    if (!novaSolicitacao.tipo) {
      toast({
        title: "Erro na solicitação",
        description: "Por favor, selecione o tipo de solicitação.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('requests').insert({
        user_id: user.id,
        type: novaSolicitacao.tipo,
        start_date: novaSolicitacao.dataInicio,
        end_date: novaSolicitacao.dataFim || null,
        notes: novaSolicitacao.observacoes,
        uniform_type: novaSolicitacao.tipo === 'uniforme' ? novaSolicitacao.tipoUniforme : null,
        uniform_size: novaSolicitacao.tipo === 'uniforme' ? novaSolicitacao.tamanhoUniforme : null,
        uniform_quantity: novaSolicitacao.tipo === 'uniforme' ? novaSolicitacao.quantidade : null,
      });

      if (error) throw error;

      toast({
        title: "Solicitação enviada",
        description: "Sua solicitação foi enviada com sucesso!",
      });

      setNovaSolicitacao({
        tipo: "",
        dataInicio: "",
        dataFim: "",
        observacoes: "",
        tamanhoUniforme: "",
        tipoUniforme: "",
        quantidade: 1,
      });
      
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Erro ao enviar solicitação",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Tipo de Solicitação</label>
        <select
          className="w-full p-2 border rounded-md"
          value={novaSolicitacao.tipo}
          onChange={(e) =>
            setNovaSolicitacao({
              ...novaSolicitacao,
              tipo: e.target.value,
            })
          }
          required
        >
          <option value="">Selecione o tipo</option>
          <option value="uniforme">Uniforme</option>
          <option value="ferias">Férias</option>
          <option value="documento">Documento</option>
          <option value="outros">Outros</option>
        </select>
      </div>

      {novaSolicitacao.tipo === "uniforme" && (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de Uniforme</label>
            <select
              className="w-full p-2 border rounded-md"
              value={novaSolicitacao.tipoUniforme}
              onChange={(e) =>
                setNovaSolicitacao({
                  ...novaSolicitacao,
                  tipoUniforme: e.target.value,
                })
              }
              required
            >
              <option value="">Selecione o tipo</option>
              <option value="camisa-social">Camisa Social</option>
              <option value="camisa-polo">Camisa Polo</option>
              <option value="calca">Calça</option>
              <option value="blazer">Blazer</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tamanho</label>
            <select
              className="w-full p-2 border rounded-md"
              value={novaSolicitacao.tamanhoUniforme}
              onChange={(e) =>
                setNovaSolicitacao({
                  ...novaSolicitacao,
                  tamanhoUniforme: e.target.value,
                })
              }
              required
            >
              <option value="">Selecione o tamanho</option>
              <option value="PP">PP</option>
              <option value="P">P</option>
              <option value="M">M</option>
              <option value="G">G</option>
              <option value="GG">GG</option>
              <option value="XG">XG</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Quantidade</label>
            <Input
              type="number"
              min="1"
              max="5"
              value={novaSolicitacao.quantidade}
              onChange={(e) =>
                setNovaSolicitacao({
                  ...novaSolicitacao,
                  quantidade: parseInt(e.target.value),
                })
              }
              required
            />
            <p className="text-xs text-muted-foreground">
              Máximo de 5 unidades por solicitação
            </p>
          </div>
        </>
      )}

      {(novaSolicitacao.tipo === "ferias" || novaSolicitacao.tipo === "documento") && (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium">Data de Início</label>
            <Input
              type="date"
              value={novaSolicitacao.dataInicio}
              onChange={(e) =>
                setNovaSolicitacao({
                  ...novaSolicitacao,
                  dataInicio: e.target.value,
                })
              }
              required
            />
          </div>
          {novaSolicitacao.tipo === "ferias" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Data de Fim</label>
              <Input
                type="date"
                value={novaSolicitacao.dataFim}
                onChange={(e) =>
                  setNovaSolicitacao({
                    ...novaSolicitacao,
                    dataFim: e.target.value,
                  })
                }
                required
              />
            </div>
          )}
        </>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Observações</label>
        <textarea
          className="w-full p-2 border rounded-md min-h-[100px]"
          value={novaSolicitacao.observacoes}
          onChange={(e) =>
            setNovaSolicitacao({
              ...novaSolicitacao,
              observacoes: e.target.value,
            })
          }
          placeholder="Adicione observações importantes sobre sua solicitação..."
        />
      </div>
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
