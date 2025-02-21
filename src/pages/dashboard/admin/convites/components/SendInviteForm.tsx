
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface SendInviteFormProps {
  onSuccess: () => void;
}

export const SendInviteForm = ({ onSuccess }: SendInviteFormProps) => {
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;

    try {
      const { error } = await supabase
        .from('admin_invites')
        .insert({ email });

      if (error) throw error;

      toast({
        title: "Convite enviado",
        description: "O convite foi enviado com sucesso.",
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Erro ao enviar convite",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Enviar Convite</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input 
            name="email" 
            type="email" 
            required 
            placeholder="Digite o email do novo administrador"
          />
        </div>
        <Button type="submit" className="w-full">
          Enviar Convite
        </Button>
      </form>
    </DialogContent>
  );
};
