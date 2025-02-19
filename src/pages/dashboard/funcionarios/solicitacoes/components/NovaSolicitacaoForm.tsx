
import { Button } from "@/components/ui/button";
import UniformeForm from "./UniformeForm";
import DatasForm from "./DatasForm";
import { useSolicitacaoForm } from "../hooks/useSolicitacaoForm";

interface NovaSolicitacaoFormProps {
  onSuccess: () => void;
}

const NovaSolicitacaoForm = ({ onSuccess }: NovaSolicitacaoFormProps) => {
  const { novaSolicitacao, loading, handleChange, handleSubmit } = useSolicitacaoForm({
    onSuccess,
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Tipo de Solicitação</label>
        <select
          className="w-full p-2 border rounded-md"
          value={novaSolicitacao.tipo}
          onChange={(e) => handleChange("tipo", e.target.value)}
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
        <UniformeForm
          tipoUniforme={novaSolicitacao.tipoUniforme}
          tamanhoUniforme={novaSolicitacao.tamanhoUniforme}
          quantidade={novaSolicitacao.quantidade}
          onChange={handleChange}
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
