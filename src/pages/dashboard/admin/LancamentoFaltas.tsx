
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
import { AbsenceCard } from "./components/AbsenceCard";
import { AbsenceForm } from "./components/AbsenceForm";
import { type Absence } from "./types/absences";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const LancamentoFaltas = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [coverageType, setCoverageType] = useState<"standby" | "prestador">("standby");
  const { toast } = useToast();

  const { data: absences, refetch } = useQuery({
    queryKey: ["absences"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("absences")
        .select("*")
        .order("absence_date", { ascending: false });
      if (error) throw error;
      return data as Absence[];
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, absenceId: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${absenceId}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("justifications")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("justifications")
        .getPublicUrl(fileName);

      await supabase
        .from("absences")
        .update({
          justification_file_url: publicUrl,
          status: "justified",
        })
        .eq("id", absenceId);

      toast({
        title: "Justificativa enviada",
        description: "O arquivo foi enviado com sucesso!",
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Erro ao enviar arquivo",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDownloadReport = async () => {
    try {
      const { data, error } = await supabase
        .from("absences")
        .select("*")
        .eq("coverage_type", "prestador");

      if (error) throw error;

      const headers = [
        "Data da Falta",
        "Nome do Funcionário",
        "CPF do Funcionário",
        "Função",
        "Posto",
        "Nome do Prestador",
        "CPF do Prestador",
        "Valor",
        "Banco",
        "Agência",
        "Conta",
        "Tipo de Conta",
        "PIX",
        "Status",
      ];

      const csv = [
        headers.join(","),
        ...data.map(absence => {
          const bankInfo = absence.coverage_bank_info;
          const formattedDate = format(new Date(absence.absence_date), "dd/MM/yyyy");
          return [
            formattedDate,
            absence.employee_name,
            absence.employee_cpf,
            absence.position_title,
            absence.workplace,
            absence.coverage_name,
            absence.coverage_cpf,
            absence.coverage_value,
            bankInfo?.bank || '',
            bankInfo?.agency || '',
            bankInfo?.account || '',
            bankInfo?.account_type || '',
            bankInfo?.pix || '',
            absence.status,
          ].join(",");
        })
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      const currentDate = format(new Date(), "dd-MM-yyyy", { locale: ptBR });
      a.href = url;
      a.download = `prestadores-${currentDate}.csv`;
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

  const handleDownloadMonthlyReport = async () => {
    try {
      const { data, error } = await supabase
        .from("absences")
        .select("*")
        .order("absence_date", { ascending: true });

      if (error) throw error;

      const headers = [
        "Data da Falta",
        "Nome do Funcionário",
        "CPF do Funcionário",
        "Função",
        "Posto",
        "Tipo de Cobertura",
        "Nome do Cobertor",
        "CPF do Cobertor",
        "Status",
        "Justificado"
      ];

      const csv = [
        headers.join(","),
        ...data.map(absence => {
          const formattedDate = format(new Date(absence.absence_date), "dd/MM/yyyy");
          return [
            formattedDate,
            absence.employee_name,
            absence.employee_cpf,
            absence.position_title,
            absence.workplace,
            absence.coverage_type === "standby" ? "Standby" : "Prestador",
            absence.coverage_name,
            absence.coverage_cpf,
            absence.status,
            absence.justification_file_url ? "Sim" : "Não"
          ].join(",");
        })
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      const currentDate = format(new Date(), "dd-MM-yyyy", { locale: ptBR });
      a.href = url;
      a.download = `faltas-${currentDate}.csv`;
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

  const handleAddAbsence = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const absenceData: Partial<Absence> = {
        employee_name: formData.get("name") as string,
        employee_cpf: formData.get("cpf") as string,
        position_title: formData.get("position") as string,
        workplace: formData.get("workplace") as string,
        absence_date: formData.get("date") as string,
        coverage_type: coverageType,
        coverage_name: formData.get("coverage_name") as string,
        coverage_cpf: formData.get("coverage_cpf") as string,
      };

      if (coverageType === "prestador") {
        absenceData.coverage_value = Number(formData.get("coverage_value"));
        absenceData.coverage_bank_info = {
          bank: formData.get("bank") as string,
          agency: formData.get("agency") as string,
          account: formData.get("account") as string,
          account_type: formData.get("account_type") as string,
          pix: formData.get("pix") as string,
        };
      }

      const { error } = await supabase.from("absences").insert(absenceData);

      if (error) throw error;

      toast({
        title: "Falta registrada",
        description: "A falta foi registrada com sucesso!",
      });

      setIsAddDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast({
        title: "Erro ao registrar falta",
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
                Lançamento de Faltas
              </h2>
              <p className="text-muted-foreground">
                Gerencie as faltas e coberturas dos funcionários
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={handleDownloadMonthlyReport}>
                <FileDown className="mr-2 h-4 w-4" />
                Relatório de Faltas
              </Button>
              <Button variant="outline" onClick={handleDownloadReport}>
                <FileDown className="mr-2 h-4 w-4" />
                Relatório de Prestadores
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Lançar Falta
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl h-[90vh]">
                  <DialogHeader>
                    <DialogTitle>Lançar Falta</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-full pr-4">
                    <AbsenceForm
                      coverageType={coverageType}
                      onCoverageTypeChange={setCoverageType}
                      onSubmit={handleAddAbsence}
                    />
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {absences?.map((absence) => (
              <AbsenceCard
                key={absence.id}
                absence={absence}
                onFileUpload={handleFileUpload}
              />
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default LancamentoFaltas;

