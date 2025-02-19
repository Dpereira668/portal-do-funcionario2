import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

interface UniformItem {
  tipoUniforme: string;
  tamanhoUniforme: string;
  quantidade: number;
}

interface UseSolicitacaoFormProps {
  onSuccess: () => void;
  tipoInicial?: string;
}

export const useSolicitacaoForm = ({ onSuccess, tipoInicial }: UseSolicitacaoFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [novaSolicitacao, setNovaSolicitacao] = useState({
    tipo: tipoInicial || "",
    dataInicio: "",
    dataFim: "",
    observacoes: "",
    uniformeItens: [{ tipoUniforme: "", tamanhoUniforme: "", quantidade: 1 }],
    advance_amount: 0,
    advance_reason: "",
  });

  const handleChange = (field: string, value: any) => {
    setNovaSolicitacao((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setNovaSolicitacao({
      tipo: "",
      dataInicio: "",
      dataFim: "",
      observacoes: "",
      uniformeItens: [{ tipoUniforme: "", tamanhoUniforme: "", quantidade: 1 }],
      advance_amount: 0,
      advance_reason: "",
    });
  };

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
      if (novaSolicitacao.tipo === 'uniforme') {
        const promises = novaSolicitacao.uniformeItens.map(item => 
          supabase.from('requests').insert({
            user_id: user.id,
            type: novaSolicitacao.tipo,
            notes: novaSolicitacao.observacoes,
            uniform_type: item.tipoUniforme,
            uniform_size: item.tamanhoUniforme,
            uniform_quantity: item.quantidade,
          })
        );

        const results = await Promise.all(promises);
        const errors = results.filter(result => result.error);

        if (errors.length > 0) {
          throw errors[0].error;
        }
      } else {
        const { error } = await supabase.from('requests').insert({
          user_id: user.id,
          type: novaSolicitacao.tipo,
          start_date: novaSolicitacao.dataInicio,
          end_date: novaSolicitacao.dataFim || null,
          notes: novaSolicitacao.observacoes,
          advance_amount: novaSolicitacao.tipo === 'adiantamento' ? novaSolicitacao.advance_amount : null,
          advance_reason: novaSolicitacao.tipo === 'adiantamento' ? novaSolicitacao.advance_reason : null,
        });

        if (error) throw error;
      }

      toast({
        title: "Solicitação enviada",
        description: "Sua solicitação foi enviada com sucesso!",
      });

      resetForm();
      queryClient.invalidateQueries({ queryKey: ['solicitacoes'] });
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

  return {
    novaSolicitacao,
    loading,
    handleChange,
    handleSubmit,
  };
};
