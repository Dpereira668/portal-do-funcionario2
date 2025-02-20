
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface AddVacationFormProps {
  onSuccess: () => void;
}

export const AddVacationForm = ({ onSuccess }: AddVacationFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    try {
      const { error } = await supabase
        .from('vacation_schedules')
        .insert({
          employee_name: formData.get('employee_name'),
          employee_cpf: formData.get('employee_cpf'),
          position_title: formData.get('position_title'),
          workplace: formData.get('workplace'),
          start_date: formData.get('start_date'),
          end_date: formData.get('end_date'),
          observation: formData.get('observation'),
        });

      if (error) throw error;

      toast({
        title: "Férias agendadas",
        description: "As férias foram agendadas com sucesso.",
      });

      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['vacation_schedules'] });
    } catch (error: any) {
      toast({
        title: "Erro ao agendar férias",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Agendar Férias</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nome do Funcionário</label>
          <Input name="employee_name" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">CPF</label>
          <Input name="employee_cpf" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Cargo</label>
          <Input name="position_title" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Local de Trabalho</label>
          <Input name="workplace" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Data de Início</label>
          <Input name="start_date" type="date" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Data de Fim</label>
          <Input name="end_date" type="date" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Observações</label>
          <Input name="observation" />
        </div>
        <Button type="submit" className="w-full">
          Agendar
        </Button>
      </form>
    </DialogContent>
  );
};
