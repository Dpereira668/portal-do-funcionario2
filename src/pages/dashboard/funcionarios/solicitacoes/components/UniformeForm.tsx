
import { Input } from "@/components/ui/input";

interface UniformeFormProps {
  tipoUniforme: string;
  tamanhoUniforme: string;
  quantidade: number;
  onChange: (field: string, value: string | number) => void;
}

const UniformeForm = ({ tipoUniforme, tamanhoUniforme, quantidade, onChange }: UniformeFormProps) => {
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium">Tipo de Uniforme</label>
        <select
          className="w-full p-2 border rounded-md"
          value={tipoUniforme}
          onChange={(e) => onChange("tipoUniforme", e.target.value)}
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
          value={tamanhoUniforme}
          onChange={(e) => onChange("tamanhoUniforme", e.target.value)}
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
          value={quantidade}
          onChange={(e) => onChange("quantidade", parseInt(e.target.value))}
          required
        />
        <p className="text-xs text-muted-foreground">
          Máximo de 5 unidades por solicitação
        </p>
      </div>
    </>
  );
};

export default UniformeForm;
