
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { PunishmentType } from "../types";

interface AddPunishmentFormProps {
  onSuccess: () => void;
}

export const AddPunishmentForm = ({ onSuccess }: AddPunishmentFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    try {
      const file = formData.get('document') as File;
      let documentUrl = '';
      
      if (file && file.size > 0) {
        const timestamp = new Date().getTime();
        const filePath = `${timestamp}_${file.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from('punishments')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = await supabase.storage
          .from('punishments')
          .getPublicUrl(filePath);

        documentUrl = urlData.publicUrl;
      }

      const { error } = await supabase
        .from('punishments')
        .insert({
          type: formData.get('type') as PunishmentType,
          reason: formData.get('reason'),
          start_date: formData.get('start_date'),
          end_date: formData.get('end_date') || null,
          document_url: documentUrl || null,
          employee_id: formData.get('employee_id') || null,
        });

      if (error) throw error;

      toast({
        title: "Punição registrada",
        description: "A punição foi registrada com sucesso.",
      });

      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['punishments'] });
    } catch (error: any) {
      toast({
        title: "Erro ao registrar punição",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Registrar Punição</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo</label>
          <select
            name="type"
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="">Selecione o tipo</option>
            <option value="advertencia">Advertência</option>
            <option value="suspensao">Suspensão</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Motivo</label>
          <Input name="reason" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Data de Início</label>
          <Input name="start_date" type="date" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Data de Fim</label>
          <Input name="end_date" type="date" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">ID do Funcionário</label>
          <Input name="employee_id" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Documento</label>
          <Input name="document" type="file" accept=".pdf,.doc,.docx" />
        </div>
        <Button type="submit" className="w-full">
          Registrar
        </Button>
      </form>
    </DialogContent>
  );
};
