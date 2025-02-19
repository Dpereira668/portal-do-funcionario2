
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { FileDown, Plus } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VacationScheduleForm } from "./components/VacationScheduleForm";
import { VacationScheduleCard } from "./components/VacationScheduleCard";
import type { VacationSchedule } from "./types/vacations";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const GestaoFerias = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: vacationSchedules, refetch } = useQuery({
    queryKey: ["vacation_schedules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vacation_schedules")
        .select("*")
        .order("start_date", { ascending: false });
      if (error) throw error;
      return data as VacationSchedule[];
    },
  });

  const handleDownloadReport = async () => {
    try {
      const { data, error } = await supabase
        .from("vacation_schedules")
        .select("*")
        .order("start_date", { ascending: true });

      if (error) throw error;

      const headers = [
        "Nome do Funcionário",
        "CPF",
        "Função",
        "Posto",
        "Data de Início",
        "Data de Término",
        "Observação"
      ];

      const csv = [
        headers.join(","),
        ...data.map(schedule => {
          const startDate = format(new Date(schedule.start_date), "dd/MM/yyyy");
          const endDate = format(new Date(schedule.end_date), "dd/MM/yyyy");
          return [
            schedule.employee_name,
            schedule.employee_cpf,
            schedule.position_title,
            schedule.workplace,
            startDate,
            endDate,
            schedule.observation || ''
          ].join(",");
        })
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      const currentDate = format(new Date(), "dd-MM-yyyy", { locale: ptBR });
      a.href = url;
      a.download = `ferias-${currentDate}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      toast({
        title: "Erro ao baixar relatório",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddVacationSchedule = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const scheduleData = {
        employee_name: formData.get("name") as string,
        employee_cpf: formData.get("cpf") as string,
        position_title: formData.get("position") as string,
        workplace: formData.get("workplace") as string,
        start_date: formData.get("start_date") as string,
        end_date: formData.get("end_date") as string,
        observation: formData.get("observation") as string,
      };

      const { error } = await supabase
        .from("vacation_schedules")
        .insert(scheduleData);

      if (error) throw error;

      toast({
        title: "Férias agendadas",
        description: "As férias foram agendadas com sucesso!",
      });

      setIsAddDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast({
        title: "Erro ao agendar férias",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-primary">
                Gestão de Férias
              </h2>
              <p className="text-muted-foreground">
                Gerencie as férias dos funcionários
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={handleDownloadReport}>
                <FileDown className="mr-2 h-4 w-4" />
                Baixar Relatório
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Agendar Férias
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Agendar Férias</DialogTitle>
                  </DialogHeader>
                  <VacationScheduleForm onSubmit={handleAddVacationSchedule} />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {vacationSchedules?.map((schedule) => (
              <VacationScheduleCard
                key={schedule.id}
                schedule={schedule}
              />
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default GestaoFerias;

