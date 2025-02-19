
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AbsenceFormProps {
  coverageType: "standby" | "prestador";
  onCoverageTypeChange: (type: "standby" | "prestador") => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const AbsenceForm = ({
  coverageType,
  onCoverageTypeChange,
  onSubmit,
}: AbsenceFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nome do Funcionário</label>
          <Input name="name" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">CPF do Funcionário</label>
          <Input name="cpf" required pattern="\d{11}" maxLength={11} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Função</label>
          <Input name="position" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Posto</label>
          <Input name="workplace" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Data da Falta</label>
          <Input name="date" type="date" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo de Cobertura</label>
          <select
            className="w-full p-2 border rounded-md"
            value={coverageType}
            onChange={(e) =>
              onCoverageTypeChange(e.target.value as "standby" | "prestador")
            }
          >
            <option value="standby">Standby</option>
            <option value="prestador">Prestador</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Nome do Cobertor</label>
          <Input name="coverage_name" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">CPF do Cobertor</label>
          <Input name="coverage_cpf" required pattern="\d{11}" maxLength={11} />
        </div>
      </div>

      {coverageType === "prestador" && (
        <div className="border-t pt-4 mt-4">
          <h4 className="font-medium mb-4">Dados Bancários do Prestador</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Valor</label>
              <Input name="coverage_value" type="number" step="0.01" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Banco</label>
              <Input name="bank" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Agência</label>
              <Input name="agency" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Conta</label>
              <Input name="account" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Conta</label>
              <select
                name="account_type"
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="corrente">Corrente</option>
                <option value="poupanca">Poupança</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">PIX</label>
              <Input name="pix" />
            </div>
          </div>
        </div>
      )}

      <Button type="submit" className="w-full mt-6">
        Registrar Falta
      </Button>
    </form>
  );
};
