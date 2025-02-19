
export interface Profile {
  id: string;
  name: string | null;
  role: 'admin' | 'funcionario';
  department: string | null;
  created_at: string;
  updated_at: string;
}

export interface Request {
  id: string;
  user_id: string;
  type: 'uniforme' | 'ferias' | 'documento' | 'outros';
  status: 'pendente' | 'aprovado' | 'rejeitado';
  start_date: string;
  end_date: string | null;
  notes: string | null;
  uniform_type: string | null;
  uniform_size: string | null;
  uniform_quantity: number | null;
  created_at: string;
  updated_at: string;
}
