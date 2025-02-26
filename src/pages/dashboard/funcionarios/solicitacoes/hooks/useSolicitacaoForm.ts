
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
    console.log(`Campo atualizado: ${field}`, value);
    setNovaSolicitacao((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    console.log("Formulário resetado");
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
      console.error("Tentativa de submissão sem usuário autenticado");
      toast({
        title: "Erro na solicitação",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return;
    }

    if (!novaSolicitacao.tipo) {
      console.error("Tentativa de submissão sem tipo de solicitação");
      toast({
        title: "Erro na solicitação",
        description: "Por favor, selecione o tipo de solicitação.",
        variant: "destructive",
      });
      return;
    }

    console.log("Iniciando submissão de solicitação:", {
      tipo: novaSolicitacao.tipo,
      userId: user.id,
      dados: novaSolicitacao
    });

    setLoading(true);
    try {
      if (novaSolicitacao.tipo === 'uniforme') {
        // Validar itens do uniforme
        if (novaSolicitacao.uniformeItens.some(item => !item.tipoUniforme || !item.tamanhoUniforme)) {
          throw new Error("Preencha todos os campos do uniforme");
        }

        console.log("Processando solicitação de uniforme:", novaSolicitacao.uniformeItens);
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
          console.error("Erros ao processar solicitações de uniforme:", errors);
          throw errors[0].error;
        }

        console.log("Solicitações de uniforme processadas com sucesso:", results);
      } else {
        // Validar campos específicos para cada tipo de solicitação
        if (novaSolicitacao.tipo === 'adiantamento' && !novaSolicitacao.advance_reason) {
          console.error("Tentativa de solicitar adiantamento sem motivo");
          throw new Error("Informe o motivo do adiantamento");
        }

        if ((novaSolicitacao.tipo === 'ferias' || novaSolicitacao.tipo === 'documento') && !novaSolicitacao.dataInicio) {
          console.error("Tentativa de solicitar férias/documento sem data de início");
          throw new Error("Selecione a data de início");
        }

        console.log("Processando solicitação genérica:", {
          tipo: novaSolicitacao.tipo,
          dados: novaSolicitacao
        });

        const { data, error } = await supabase.from('requests').insert({
          user_id: user.id,
          type: novaSolicitacao.tipo,
          start_date: novaSolicitacao.dataInicio,
          end_date: novaSolicitacao.dataFim || null,
          notes: novaSolicitacao.observacoes,
          advance_amount: novaSolicitacao.tipo === 'adiantamento' ? novaSolicitacao.advance_amount : null,
          advance_reason: novaSolicitacao.tipo === 'adiantamento' ? novaSolicitacao.advance_reason : null,
        });

        if (error) {
          console.error("Erro ao processar solicitação:", error);
          throw error;
        }

        console.log("Solicitação processada com sucesso:", data);
      }

      toast({
        title: "Solicitação enviada",
        description: "Sua solicitação foi enviada com sucesso!",
      });

      resetForm();
      queryClient.invalidateQueries({ queryKey: ['solicitacoes'] });
      onSuccess();
    } catch (error: any) {
      console.error("Erro fatal ao processar solicitação:", error);
      toast({
        title: "Erro ao enviar solicitação",
        description: error.message || "Ocorreu um erro ao enviar sua solicitação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      console.log("Processamento de solicitação finalizado");
    }
  };

  return {
    novaSolicitacao,
    loading,
    handleChange,
    handleSubmit,
  };
};

