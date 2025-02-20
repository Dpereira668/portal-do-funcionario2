
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Plus, FileDown } from "lucide-react";
import { AddVacationForm } from "./components/AddVacationForm";
import { VacationCard } from "./components/VacationCard";
import { VacationSchedule } from "./types";

const FeriasIndex = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: schedules, isLoading } = useQuery({
    queryKey: ['vacation_schedules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vacation_schedules')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) throw error;
      return data as VacationSchedule[];
    }
  });

  const exportToCSV = () => {
    if (!schedules) return;

    const headers = ['Nome', 'CPF', 'Cargo', 'Local', 'Data Início', 'Data Fim', 'Observações'];
    const csvContent = [
      headers.join(','),
      ...schedules.map(schedule => [
        schedule.employee_name,
        schedule.employee_cpf,
        schedule.position_title,
        schedule.workplace,
        schedule.start_date,
        schedule.end_date,
        schedule.observation || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ferias_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <ScrollArea className="h-screen">
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-primary">Gestão de Férias</h2>
            <p className="text-muted-foreground">
              Planejamento e controle de férias dos funcionários
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
                  Agendar Férias
                </Button>
              </DialogTrigger>
              <AddVacationForm onSuccess={() => setIsAddDialogOpen(false)} />
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <p>Carregando...</p>
          ) : schedules?.map((schedule) => (
            <VacationCard key={schedule.id} schedule={schedule} />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default FeriasIndex;
