
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface AddPositionFormProps {
  onSuccess: () => void;
}

export const AddPositionForm = ({ onSuccess }: AddPositionFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    try {
      const { error } = await supabase
        .from('positions')
        .insert({
          title: formData.get('title'),
          description: formData.get('description'),
        });

      if (error) throw error;

      toast({
        title: "Cargo criado",
        description: "O cargo foi criado com sucesso.",
      });

      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['positions'] });
    } catch (error: any) {
      toast({
        title: "Erro ao criar cargo",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Novo Cargo</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Título do Cargo</label>
          <Input name="title" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Descrição</label>
          <Textarea 
            name="description" 
            placeholder="Descreva as responsabilidades e atribuições do cargo"
          />
        </div>
        <Button type="submit" className="w-full">
          Criar Cargo
        </Button>
      </form>
    </DialogContent>
  );
};
