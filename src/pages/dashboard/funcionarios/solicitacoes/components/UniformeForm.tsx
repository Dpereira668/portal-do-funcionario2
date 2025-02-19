
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface UniformItem {
  tipoUniforme: string;
  tamanhoUniforme: string;
  quantidade: number;
}

interface UniformeFormProps {
  itens: UniformItem[];
  onChange: (items: UniformItem[]) => void;
}

const UniformeForm = ({ itens, onChange }: UniformeFormProps) => {
  const handleAddItem = () => {
    onChange([
      ...itens,
      { tipoUniforme: "", tamanhoUniforme: "", quantidade: 1 },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    onChange(itens.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof UniformItem, value: string | number) => {
    const newItens = [...itens];
    newItens[index] = {
      ...newItens[index],
      [field]: value,
    };
    onChange(newItens);
  };

  return (
    <div className="space-y-4">
      {itens.map((item, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Item {index + 1}</h4>
            {itens.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveItem(index)}
                className="h-8 w-8 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de Uniforme</label>
            <select
              className="w-full p-2 border rounded-md"
              value={item.tipoUniforme}
              onChange={(e) => handleItemChange(index, "tipoUniforme", e.target.value)}
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
              value={item.tamanhoUniforme}
              onChange={(e) => handleItemChange(index, "tamanhoUniforme", e.target.value)}
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
              value={item.quantidade}
              onChange={(e) => handleItemChange(index, "quantidade", parseInt(e.target.value))}
              required
            />
            <p className="text-xs text-muted-foreground">
              Máximo de 5 unidades por item
            </p>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={handleAddItem}
        className="w-full"
        disabled={itens.length >= 3}
      >
        Adicionar Item
      </Button>
      {itens.length >= 3 && (
        <p className="text-xs text-muted-foreground text-center">
          Máximo de 3 itens por solicitação
        </p>
      )}
    </div>
  );
};

export default UniformeForm;
