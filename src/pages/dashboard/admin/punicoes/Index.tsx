
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Plus, FileDown } from "lucide-react";
import { AddPunishmentForm } from "./components/AddPunishmentForm";
import { PunishmentCard } from "./components/PunishmentCard";
import { Punishment } from "./types";

const PunicoesIndex = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: punishments, isLoading } = useQuery({
    queryKey: ['punishments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('punishments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Punishment[];
    }
  });

  const exportToCSV = () => {
    if (!punishments) return;

    const headers = ['Tipo', 'Motivo', 'Data Início', 'Data Fim', 'ID Funcionário'];
    const csvContent = [
      headers.join(','),
      ...punishments.map(punishment => [
        punishment.type,
        punishment.reason,
        punishment.start_date,
        punishment.end_date || '',
        punishment.employee_id || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `punicoes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <ScrollArea className="h-screen">
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-primary">Gestão de Punições</h2>
            <p className="text-muted-foreground">
              Registro e controle de advertências e suspensões
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={exportToCSV}>
              <FileDown className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Punição
                </Button>
              </DialogTrigger>
              <AddPunishmentForm onSuccess={() => setIsAddDialogOpen(false)} />
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <p>Carregando...</p>
          ) : punishments?.map((punishment) => (
            <PunishmentCard key={punishment.id} punishment={punishment} />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default PunicoesIndex;
