
export interface BankInfo {
  bank: string;
  agency: string;
  account: string;
  account_type: string;
  pix: string;
}

export type JustificationType = "sem_justificativa" | "atestado" | "declaracao" | "suspensao";

export interface Absence {
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
  justification_type: JustificationType;
  suspension_id?: string;
}
