
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Plus } from "lucide-react";
import { SendInviteForm } from "./components/SendInviteForm";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AdminInvite {
  id: string;
  email: string;
  created_at: string;
  expires_at: string;
  used_at: string | null;
}

const ConvitesIndex = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: invites, isLoading } = useQuery({
    queryKey: ['admin-invites'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_invites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as AdminInvite[];
    }
  });

  const formatDate = (date: string) => {
    return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  return (
    <ScrollArea className="h-screen">
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-primary">Convites</h2>
            <p className="text-muted-foreground">
              Gerenciar convites para novos administradores
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Convite
              </Button>
            </DialogTrigger>
            <SendInviteForm onSuccess={() => setIsAddDialogOpen(false)} />
          </Dialog>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <p>Carregando...</p>
          ) : invites?.map((invite) => (
            <div
              key={invite.id}
              className="p-4 rounded-lg border bg-card text-card-foreground"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{invite.email}</h3>
                  <p className="text-sm text-muted-foreground">
                    Criado em: {formatDate(invite.created_at)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Expira em: {formatDate(invite.expires_at)}
                  </p>
                </div>
                <div className="text-sm">
                  {invite.used_at ? (
                    <span className="text-green-600">Utilizado</span>
                  ) : (
                    <span className="text-yellow-600">Pendente</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default ConvitesIndex;
