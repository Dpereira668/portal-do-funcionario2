
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { FileText, Plus, Upload } from "lucide-react";
import { useState } from "react";

interface VacationSchedule {
  employee_name: string;
  employee_cpf: string;
  position_title: string;
  workplace: string;
  start_date: string;
  end_date: string;
  observation: string;
}

const GestaoFerias = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: vacationSchedules, refetch } = useQuery({
    queryKey: ["vacation-schedules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vacation_schedules")
        .select(`
          *,
          profiles(name, cpf, positions(title), workplace)
        `);
      if (error) throw error;
      return data;
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const rows = text.split("\n").slice(1); // Pula o cabeçalho

      for (const row of rows) {
        const [
          name,
          cpf,
          position,
          workplace,
          startDate,
          endDate,
          observation,
        ] = row.split(",").map((item) => item.trim());

        await supabase.from("vacation_schedules").insert({
          employee_name: name,
          employee_cpf: cpf,
          position_title: position,
          workplace,
          start_date: startDate,
          end_date: endDate,
          observation,
        });
      }

      toast({
        title: "Férias importadas",
        description: "As férias foram importadas com sucesso!",
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Erro na importação",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddVacation = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const { error } = await supabase.from("vacation_schedules").insert({
        employee_name: formData.get("name"),
        employee_cpf: formData.get("cpf"),
        position_title: formData.get("position"),
        workplace: formData.get("workplace"),
        start_date: formData.get("start_date"),
        end_date: formData.get("end_date"),
        observation: formData.get("observation"),
      });

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
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-primary">Gestão de Férias</h2>
          <p className="text-muted-foreground">
            Gerencie as férias dos funcionários
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            Importar XML
            <input
              id="file-upload"
              type="file"
              accept=".csv,.xml"
              className="hidden"
              onChange={handleFileUpload}
            />
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Agendar Férias
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agendar Férias</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddVacation} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome</label>
                  <Input name="name" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">CPF</label>
                  <Input
                    name="cpf"
                    required
                    pattern="\d{11}"
                    maxLength={11}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Função</label>
                  <Input name="position" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Posto</label>
                  <Input name="workplace" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data Início</label>
                  <Input name="start_date" type="date" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data Fim</label>
                  <Input name="end_date" type="date" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Observação</label>
                  <textarea
                    name="observation"
                    className="w-full p-2 border rounded-md min-h-[100px]"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Agendar
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {vacationSchedules?.map((schedule) => (
          <div
            key={schedule.id}
            className="border rounded-lg p-4 space-y-2 bg-white shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{schedule.employee_name}</h3>
                <p className="text-sm text-muted-foreground">
                  CPF: {schedule.employee_cpf}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  {new Date(schedule.start_date).toLocaleDateString()} até{" "}
                  {new Date(schedule.end_date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm">
                <strong>Função:</strong> {schedule.position_title}
              </p>
              <p className="text-sm">
                <strong>Posto:</strong> {schedule.workplace}
              </p>
            </div>
            {schedule.observation && (
              <div className="mt-2 p-2 bg-muted rounded-md">
                <p className="text-sm">{schedule.observation}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GestaoFerias;
