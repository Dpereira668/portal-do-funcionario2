
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { type Absence } from "../types/absences";

export const downloadCSV = (csv: string, filename: string) => {
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  const currentDate = format(new Date(), "dd-MM-yyyy", { locale: ptBR });
  a.href = url;
  a.download = `${filename}-${currentDate}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const formatProviderReport = (absences: Absence[]) => {
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

  return [
    headers.join(","),
    ...absences.map(absence => {
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
};

export const formatMonthlyReport = (absences: Absence[]) => {
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

  return [
    headers.join(","),
    ...absences.map(absence => {
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
};
