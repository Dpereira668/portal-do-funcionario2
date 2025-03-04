
import { supabase } from "@/lib/supabase";
import { Uniform } from "@/pages/dashboard/admin/uniformes/types";
import { logUserAction } from "./auditLogService";
import { useToast } from "@/hooks/use-toast";

export async function getUniforms(page = 0, pageSize = 10) {
  console.log(`Buscando uniforms do Supabase (página ${page}, tamanho ${pageSize})`);
  const startRow = page * pageSize;
  const endRow = startRow + pageSize - 1;
  
  const { data, error, count } = await supabase
    .from('uniforms')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(startRow, endRow);
  
  if (error) {
    console.error("Erro ao buscar uniforms:", error);
    throw error;
  }
  
  return { 
    data: data as Uniform[],
    totalCount: count || 0,
    hasMore: (count || 0) > (startRow + pageSize)
  };
}

export async function addUniform(uniformData: Omit<Uniform, "id" | "created_at" | "updated_at">, userId: string) {
  console.log("Adicionando uniform ao Supabase:", uniformData);
  const { data, error } = await supabase
    .from('uniforms')
    .insert(uniformData)
    .select();

  if (error) {
    console.error("Erro ao adicionar uniform:", error);
    throw error;
  }
  
  // Log the action
  if (data && data.length > 0) {
    await logUserAction({
      user_id: userId,
      action: 'create',
      resource_type: 'uniform',
      resource_id: data[0].id,
      details: { ...uniformData }
    });
  }
  
  return data;
}

export async function updateUniform(id: string, uniformData: Partial<Uniform>, userId: string) {
  console.log(`Atualizando uniform ${id}:`, uniformData);
  
  // Get the old data first for logging purposes
  const { data: oldData, error: fetchError } = await supabase
    .from('uniforms')
    .select('*')
    .eq('id', id)
    .single();
    
  if (fetchError) {
    console.error(`Erro ao buscar dados antigos do uniform ${id}:`, fetchError);
  }
  
  const { data, error } = await supabase
    .from('uniforms')
    .update(uniformData)
    .eq('id', id)
    .select();

  if (error) {
    console.error("Erro ao atualizar uniform:", error);
    throw error;
  }
  
  // Log the action with both old and new data for comparison
  if (data && data.length > 0) {
    await logUserAction({
      user_id: userId,
      action: 'update',
      resource_type: 'uniform',
      resource_id: id,
      details: { 
        previous: oldData,
        updated: uniformData
      }
    });
  }
  
  return data;
}

export async function deleteUniform(id: string, userId: string) {
  console.log(`Excluindo uniform ${id}`);
  
  // Get the data first for logging purposes
  const { data: oldData, error: fetchError } = await supabase
    .from('uniforms')
    .select('*')
    .eq('id', id)
    .single();
    
  if (fetchError) {
    console.error(`Erro ao buscar dados do uniform ${id} antes da exclusão:`, fetchError);
  }
  
  const { error } = await supabase
    .from('uniforms')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Erro ao excluir uniform:", error);
    throw error;
  }
  
  // Log the action
  await logUserAction({
    user_id: userId,
    action: 'delete',
    resource_type: 'uniform',
    resource_id: id,
    details: { deleted_data: oldData }
  });
  
  return true;
}

export async function getUniformById(id: string) {
  console.log(`Buscando uniform ${id}`);
  const { data, error } = await supabase
    .from('uniforms')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error(`Erro ao buscar uniform ${id}:`, error);
    throw error;
  }
  
  return data as Uniform;
}
