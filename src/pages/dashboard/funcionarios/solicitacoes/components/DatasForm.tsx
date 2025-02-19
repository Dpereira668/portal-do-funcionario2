
import { Input } from "@/components/ui/input";

interface DatasFormProps {
  tipo: string;
  dataInicio: string;
  dataFim: string;
  onChange: (field: string, value: string) => void;
}

const DatasForm = ({ tipo, dataInicio, dataFim, onChange }: DatasFormProps) => {
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium">Data de Início</label>
        <Input
          type="date"
          value={dataInicio}
          onChange={(e) => onChange("dataInicio", e.target.value)}
          required
        />
      </div>
      {tipo === "ferias" && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Data de Fim</label>
          <Input
            type="date"
            value={dataFim}
            onChange={(e) => onChange("dataFim", e.target.value)}
            required
          />
        </div>
      )}
    </>
  );
};

export default DatasForm;
