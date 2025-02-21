
export interface Punishment {
  id: string;
  type: string;
  reason: string;
  start_date: string;
  end_date?: string;
  document_url?: string;
  employee_id?: string;
  created_at: string;
}

export type PunishmentType = 'advertencia' | 'suspensao';
