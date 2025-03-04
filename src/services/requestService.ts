
import { supabase } from "@/lib/supabase";
import { logUserAction } from "./auditLogService";

interface UniformRequestItem {
  tipoUniforme: string;
  tamanhoUniforme: string;
  quantidade: number;
}

interface RequestData {
  user_id: string;
  type: string;
  notes?: string;
  start_date?: string;
  end_date?: string;
  uniform_type?: string;
  uniform_size?: string;
  uniform_quantity?: number;
  advance_amount?: number;
  advance_reason?: string;
}

export async function getUserRequests(userId: string) {
  console.log("Buscando solicitações do usuário:", userId);
  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Erro ao buscar solicitações:", error);
    throw error;
  }
  
  return data;
}

export async function createUniformRequests(
  userId: string, 
  uniformItems: UniformRequestItem[], 
  notes?: string
) {
  console.log("Criando solicitações de uniforme:", uniformItems);
  
  const requests = uniformItems.map(item => ({
    user_id: userId,
    type: 'uniforme',
    notes: notes,
    uniform_type: item.tipoUniforme,
    uniform_size: item.tamanhoUniforme,
    uniform_quantity: item.quantidade,
  }));

  const { data, error } = await supabase
    .from('requests')
    .insert(requests);

  if (error) {
    console.error("Erro ao criar solicitações de uniforme:", error);
    throw error;
  }
  
  // Log each request creation
  for (const item of uniformItems) {
    await logUserAction({
      user_id: userId,
      action: 'create',
      resource_type: 'uniform_request',
      details: {
        type: 'uniforme',
        uniform_type: item.tipoUniforme,
        uniform_size: item.tamanhoUniforme,
        uniform_quantity: item.quantidade,
        notes
      }
    });
  }
  
  return data;
}

export async function createRequest(requestData: RequestData) {
  console.log("Criando solicitação:", requestData);
  
  const { data, error } = await supabase
    .from('requests')
    .insert([requestData]);

  if (error) {
    console.error("Erro ao criar solicitação:", error);
    throw error;
  }
  
  // Log the request creation
  await logUserAction({
    user_id: requestData.user_id,
    action: 'create',
    resource_type: 'request',
    resource_id: data ? data[0]?.id : undefined,
    details: { ...requestData }
  });
  
  return data;
}

export async function getAllRequests() {
  console.log("Buscando todas as solicitações");
  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Erro ao buscar solicitações:", error);
    throw error;
  }
  
  return data;
}

export async function updateRequestStatus(id: string, status: string, userId: string) {
  console.log(`Atualizando status da solicitação ${id} para ${status}`);
  
  // Get the original request for logging
  const { data: originalRequest, error: fetchError } = await supabase
    .from('requests')
    .select('*')
    .eq('id', id)
    .single();
    
  if (fetchError) {
    console.error("Erro ao buscar solicitação original:", fetchError);
  }
  
  const { data, error } = await supabase
    .from('requests')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error("Erro ao atualizar status da solicitação:", error);
    throw error;
  }
  
  // Log the status update
  await logUserAction({
    user_id: userId,
    action: 'update_status',
    resource_type: 'request',
    resource_id: id,
    details: { 
      previous_status: originalRequest?.status,
      new_status: status
    }
  });
  
  return data;
}
