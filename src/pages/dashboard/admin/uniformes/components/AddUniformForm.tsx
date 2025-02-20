
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface AddUniformFormProps {
  onSuccess: () => void;
}

export const AddUniformForm = ({ onSuccess }: AddUniformFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleAddUniform = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    try {
      const { error } = await supabase
        .from('uniforms')
        .insert({
          type: formData.get('type'),
          size: formData.get('size'),
          quantity: parseInt(formData.get('quantity') as string, 10),
          min_quantity: parseInt(formData.get('min_quantity') as string, 10),
        });

      if (error) throw error;

      toast({
        title: "Uniforme adicionado",
        description: "O uniforme foi adicionado com sucesso.",
      });

      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['uniforms'] });
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar uniforme",
        description: error.message,
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
        </div>
        <Button type="submit" className="w-full">
          Adicionar
        </Button>
      </form>
    </DialogContent>
  );
};
