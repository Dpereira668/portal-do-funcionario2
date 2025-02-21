
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface AddWorkplaceFormProps {
  onSuccess: () => void;
}

export const AddWorkplaceForm = ({ onSuccess }: AddWorkplaceFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    try {
      const { error } = await supabase
        .from('workplaces')
        .insert({
          name: formData.get('name'),
          address: formData.get('address'),
        });

      if (error) throw error;

      toast({
        title: "Unidade criada",
        description: "A unidade foi criada com sucesso.",
      });

      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['workplaces'] });
    } catch (error: any) {
      toast({
        title: "Erro ao criar unidade",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Nova Unidade</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nome da Unidade</label>
          <Input name="name" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Endereço</label>
          <Textarea 
            name="address" 
            placeholder="Digite o endereço completo da unidade"
          />
        </div>
        <Button type="submit" className="w-full">
          Criar Unidade
        </Button>
      </form>
    </DialogContent>
  );
};
