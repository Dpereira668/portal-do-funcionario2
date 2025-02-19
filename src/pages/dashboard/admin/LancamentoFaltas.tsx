
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Download, FileDown, Plus } from "lucide-react";
import { useState } from "react";

interface BankInfo {
  bank: string;
  agency: string;
  account: string;
  account_type: string;
  pix: string;
}

interface Absence {
  id: string;
  employee_name: string;
  employee_cpf: string;
  position_title: string;
  workplace: string;
  absence_date: string;
  coverage_type: "standby" | "prestador";
  coverage_name: string;
  coverage_cpf: string;
  coverage_value?: number;
  coverage_bank_info?: BankInfo;
  status: "pending" | "justified" | "unjustified";
  justification?: string;
  justification_file_url?: string;
}

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

      const csv = [
        "Nome,CPF,Valor,Banco,Agência,Conta,Tipo de Conta,PIX",
        ...data.map(absence => {
          const bankInfo = absence.coverage_bank_info as BankInfo;
          return `${absence.coverage_name},${absence.coverage_cpf},${absence.coverage_value},${bankInfo?.bank || ''},${bankInfo?.agency || ''},${bankInfo?.account || ''},${bankInfo?.account_type || ''},${bankInfo?.pix || ''}`;
        })
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "prestadores.csv";
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
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-primary">Lançamento de Faltas</h2>
          <p className="text-muted-foreground">
            Gerencie as faltas e coberturas dos funcionários
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
                Lançar Falta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Lançar Falta</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddAbsence} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome do Funcionário</label>
                    <Input name="name" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">CPF do Funcionário</label>
                    <Input name="cpf" required pattern="\d{11}" maxLength={11} />
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
                    <label className="text-sm font-medium">Data da Falta</label>
                    <Input name="date" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo de Cobertura</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={coverageType}
                      onChange={(e) => setCoverageType(e.target.value as "standby" | "prestador")}
                    >
                      <option value="standby">Standby</option>
                      <option value="prestador">Prestador</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome do Cobertor</label>
                    <Input name="coverage_name" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">CPF do Cobertor</label>
                    <Input name="coverage_cpf" required pattern="\d{11}" maxLength={11} />
                  </div>
                </div>

                {coverageType === "prestador" && (
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-medium mb-4">Dados Bancários do Prestador</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Valor</label>
                        <Input name="coverage_value" type="number" step="0.01" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Banco</label>
                        <Input name="bank" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Agência</label>
                        <Input name="agency" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Conta</label>
                        <Input name="account" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Tipo de Conta</label>
                        <select name="account_type" className="w-full p-2 border rounded-md" required>
                          <option value="corrente">Corrente</option>
                          <option value="poupanca">Poupança</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">PIX</label>
                        <Input name="pix" />
                      </div>
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full">
                  Registrar Falta
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {absences?.map((absence) => (
          <Card key={absence.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{absence.employee_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(absence.absence_date).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  absence.status === "justified"
                    ? "bg-green-100 text-green-800"
                    : absence.status === "unjustified"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {absence.status === "justified"
                    ? "Justificada"
                    : absence.status === "unjustified"
                    ? "Não Justificada"
                    : "Pendente"}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>CPF:</strong> {absence.employee_cpf}
                </p>
                <p className="text-sm">
                  <strong>Função:</strong> {absence.position_title}
                </p>
                <p className="text-sm">
                  <strong>Posto:</strong> {absence.workplace}
                </p>
                <div className="border-t pt-2 mt-2">
                  <p className="text-sm font-medium">Cobertura ({absence.coverage_type}):</p>
                  <p className="text-sm">
                    {absence.coverage_name} (CPF: {absence.coverage_cpf})
                  </p>
                  {absence.coverage_type === "prestador" && (
                    <p className="text-sm">
                      <strong>Valor:</strong> R$ {absence.coverage_value?.toFixed(2)}
                    </p>
                  )}
                </div>
                {absence.status === "pending" && (
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => document.getElementById(`file-${absence.id}`)?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Enviar Justificativa
                    </Button>
                    <input
                      id={`file-${absence.id}`}
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(e, absence.id)}
                    />
                  </div>
                )}
                {absence.justification_file_url && (
                  <div className="mt-2">
                    <a
                      href={absence.justification_file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Ver justificativa
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LancamentoFaltas;
