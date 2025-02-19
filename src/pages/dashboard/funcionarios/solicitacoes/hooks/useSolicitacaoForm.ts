
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

interface UseSolicitacaoFormProps {
  onSuccess: () => void;
}

export const useSolicitacaoForm = ({ onSuccess }: UseSolicitacaoFormProps) => {
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

  const handleChange = (field: string, value: string | number) => {
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
      tamanhoUniforme: "",
      tipoUniforme: "",
      quantidade: 1,
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

      resetForm();
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

  return {
    novaSolicitacao,
    loading,
    handleChange,
    handleSubmit,
  };
};
