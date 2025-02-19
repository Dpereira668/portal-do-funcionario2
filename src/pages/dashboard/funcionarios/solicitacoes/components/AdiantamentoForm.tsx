
import { Input } from "@/components/ui/input";

interface AdiantamentoFormProps {
  valor: number;
  motivo: string;
  onChange: (field: string, value: string | number) => void;
}

const AdiantamentoForm = ({ valor, motivo, onChange }: AdiantamentoFormProps) => {
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium">Valor do Adiantamento</label>
        <Input
          type="number"
          min="0"
          step="0.01"
          value={valor}
          onChange={(e) => onChange("advance_amount", parseFloat(e.target.value))}
          required
          placeholder="Digite o valor solicitado"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Motivo do Adiantamento</label>
        <textarea
          className="w-full p-2 border rounded-md min-h-[100px]"
          value={motivo}
          onChange={(e) => onChange("advance_reason", e.target.value)}
          placeholder="Descreva o motivo da solicitação de adiantamento..."
          required
        />
      </div>
    </>
  );
};

export default AdiantamentoForm;
