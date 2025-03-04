
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useRequestStore } from "@/store/useRequestStore";
import { validateRequest } from "@/validations/requestSchema";

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
  const { createUniformRequests, createRequest } = useRequestStore();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
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
    
    // Limpar erro do campo quando o usuário edita
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
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
    setErrors({});
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

    console.log("Validando solicitação:", {
      tipo: novaSolicitacao.tipo,
      dados: novaSolicitacao
    });
    
    const { isValid, errors: validationErrors } = await validateRequest(
      novaSolicitacao.tipo,
      novaSolicitacao
    );
    
    if (!isValid && validationErrors) {
      console.error("Erros de validação:", validationErrors);
      setErrors(validationErrors);
      toast({
        title: "Erro de validação",
        description: "Verifique os dados do formulário e tente novamente.",
        variant: "destructive",
      });
      return;
    }
    
    setErrors({});
    console.log("Iniciando submissão de solicitação:", {
      tipo: novaSolicitacao.tipo,
      userId: user.id,
      dados: novaSolicitacao
    });

    setLoading(true);
    try {
      if (novaSolicitacao.tipo === 'uniforme') {
        await createUniformRequests(
          user.id,
          novaSolicitacao.uniformeItens,
          novaSolicitacao.observacoes
        );
        
        toast({
          title: "Solicitação enviada",
          description: `Sua solicitação de ${novaSolicitacao.uniformeItens.length} item(ns) de uniforme foi enviada com sucesso!`,
        });
      } else {
        // Criar objeto de solicitação baseado no tipo
        const requestData = {
          user_id: user.id,
          type: novaSolicitacao.tipo,
          notes: novaSolicitacao.observacoes,
          start_date: novaSolicitacao.dataInicio,
          end_date: novaSolicitacao.tipo === 'ferias' ? novaSolicitacao.dataFim : undefined,
          advance_amount: novaSolicitacao.tipo === 'adiantamento' ? novaSolicitacao.advance_amount : undefined,
          advance_reason: novaSolicitacao.tipo === 'adiantamento' ? novaSolicitacao.advance_reason : undefined,
        };
        
        await createRequest(requestData);
        
        // Mensagem específica por tipo de solicitação
        let descricao = "Sua solicitação foi enviada com sucesso!";
        switch (novaSolicitacao.tipo) {
          case 'ferias':
            descricao = `Solicitação de férias para ${novaSolicitacao.dataInicio} enviada com sucesso!`;
            break;
          case 'adiantamento':
            descricao = `Solicitação de adiantamento de R$ ${novaSolicitacao.advance_amount} enviada com sucesso!`;
            break;
          case 'documento':
            descricao = `Solicitação de documento enviada com sucesso!`;
            break;
        }
        
        toast({
          title: "Solicitação enviada",
          description: descricao,
        });
      }

      resetForm();
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
    errors,
    handleChange,
    handleSubmit,
  };
};
