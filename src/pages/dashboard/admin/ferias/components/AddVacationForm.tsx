
import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

interface AddVacationFormProps {
  onSuccess: () => void;
}

export const AddVacationForm = ({ onSuccess }: AddVacationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addVacationMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const startDate = new Date(formData.get("start_date") as string);
      const endDate = new Date(formData.get("end_date") as string);

      if (startDate >= endDate) {
        throw new Error("A data de início deve ser anterior à data de término");
      }

      const { error } = await supabase.from("vacation_schedules").insert({
        employee_name: formData.get("employee_name"),
        employee_cpf: formData.get("employee_cpf"),
        position_title: formData.get("position_title"),
        workplace: formData.get("workplace"),
        start_date: format(startDate, "yyyy-MM-dd"),
        end_date: format(endDate, "yyyy-MM-dd"),
        observation: formData.get("observation"),
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Férias agendadas",
        description: "O agendamento foi registrado com sucesso",
      });
      queryClient.invalidateQueries({ queryKey: ["vacation_schedules"] });
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao agendar férias",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addVacationMutation.mutateAsync(new FormData(e.currentTarget));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Agendar Férias</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="employee_name">Nome do Funcionário</Label>
          <Input
            id="employee_name"
            name="employee_name"
            required
            placeholder="Nome completo"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="employee_cpf">CPF</Label>
          <Input
            id="employee_cpf"
            name="employee_cpf"
            required
            placeholder="000.000.000-00"
            pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="position_title">Cargo</Label>
          <Input
            id="position_title"
            name="position_title"
            required
            placeholder="Cargo atual"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="workplace">Local de Trabalho</Label>
          <Input
            id="workplace"
            name="workplace"
            required
            placeholder="Unidade/Local"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start_date">Data Início</Label>
            <Input
              id="start_date"
              name="start_date"
              type="date"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_date">Data Fim</Label>
            <Input
              id="end_date"
              name="end_date"
              type="date"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="observation">Observações</Label>
          <Textarea
            id="observation"
            name="observation"
            placeholder="Observações adicionais"
            className="min-h-[100px]"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Agendando..." : "Agendar Férias"}
        </Button>
      </form>
    </DialogContent>
  );
};
