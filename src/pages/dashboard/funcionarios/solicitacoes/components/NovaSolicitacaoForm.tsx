
import { Button } from "@/components/ui/button";
import UniformeForm from "./UniformeForm";
import DatasForm from "./DatasForm";
import AdiantamentoForm from "./AdiantamentoForm";
import { useSolicitacaoForm } from "../hooks/useSolicitacaoForm";

interface NovaSolicitacaoFormProps {
  onSuccess: () => void;
  tipoInicial?: string;
}

const NovaSolicitacaoForm = ({ onSuccess, tipoInicial }: NovaSolicitacaoFormProps) => {
  const { novaSolicitacao, loading, handleChange, handleSubmit } = useSolicitacaoForm({
    onSuccess,
    tipoInicial,
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
