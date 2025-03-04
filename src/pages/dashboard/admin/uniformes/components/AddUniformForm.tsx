
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useUniformStore } from "@/store/useUniformStore";
import { validateUniform } from "@/validations/uniformSchema";

interface AddUniformFormProps {
  onSuccess: () => void;
}

export const AddUniformForm = ({ onSuccess }: AddUniformFormProps) => {
  const { toast } = useToast();
  const addUniform = useUniformStore(state => state.addUniform);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddUniform = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const uniformData = {
      type: formData.get('type') as string,
      size: formData.get('size') as string,
      quantity: parseInt(formData.get('quantity') as string, 10),
      min_quantity: parseInt(formData.get('min_quantity') as string, 10),
    };
    
    console.log("Validando dados do uniforme:", uniformData);
    const { isValid, errors: validationErrors } = await validateUniform(uniformData);
    
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
    
    try {
      await addUniform(uniformData);
      
      toast({
        title: "Uniforme adicionado",
        description: "O uniforme foi adicionado com sucesso.",
      });

      onSuccess();
    } catch (error: any) {
      console.error('Erro ao adicionar uniforme:', error);
      toast({
        title: "Erro ao adicionar uniforme",
        description: error.message || "Ocorreu um erro ao adicionar o uniforme. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Adicionar Uniforme</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleAddUniform} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo</label>
          <Input name="type" required />
          {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Tamanho</label>
          <select
            name="size"
            className="w-full p-2 border rounded-md"
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
          {errors.size && <p className="text-sm text-red-500">{errors.size}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Quantidade</label>
          <Input 
            name="quantity" 
            type="number" 
            min="0" 
            defaultValue="0" 
            required 
          />
          {errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Quantidade Mínima</label>
          <Input 
            name="min_quantity" 
            type="number" 
            min="0" 
            defaultValue="0" 
            required 
          />
          {errors.min_quantity && <p className="text-sm text-red-500">{errors.min_quantity}</p>}
        </div>
        <Button type="submit" className="w-full">
          Adicionar
        </Button>
      </form>
    </DialogContent>
  );
};
