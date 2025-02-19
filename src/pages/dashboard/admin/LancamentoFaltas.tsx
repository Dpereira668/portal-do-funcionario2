
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AbsenceHeader } from "./components/AbsenceHeader";
import { AbsenceList } from "./components/AbsenceList";
import { type Absence } from "./types/absences";
import { 
  downloadCSV, 
  formatProviderReport, 
  formatMonthlyReport 
} from "./utils/exportUtils";

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
      
      const csv = formatProviderReport(data);
      downloadCSV(csv, "prestadores");
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

      const csv = formatMonthlyReport(data);
      downloadCSV(csv, "faltas");
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
          <AbsenceHeader
            isAddDialogOpen={isAddDialogOpen}
            setIsAddDialogOpen={setIsAddDialogOpen}
            coverageType={coverageType}
            onCoverageTypeChange={setCoverageType}
            onAddAbsence={handleAddAbsence}
            onDownloadMonthlyReport={handleDownloadMonthlyReport}
            onDownloadProviderReport={handleDownloadReport}
          />
          <AbsenceList
            absences={absences}
            onFileUpload={handleFileUpload}
          />
        </div>
      </ScrollArea>
    </div>
  );
};

export default LancamentoFaltas;
