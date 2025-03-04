
import { supabase } from "@/lib/supabase";
import { Uniform } from "@/pages/dashboard/admin/uniformes/types";
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

export async function addUniform(uniformData: Omit<Uniform, "id" | "created_at" | "updated_at">) {
  console.log("Adicionando uniform ao Supabase:", uniformData);
  const { data, error } = await supabase
    .from('uniforms')
    .insert(uniformData)
    .select();

  if (error) {
    console.error("Erro ao adicionar uniform:", error);
    throw error;
  }
  
  return data;
}

export async function updateUniform(id: string, uniformData: Partial<Uniform>) {
  console.log(`Atualizando uniform ${id}:`, uniformData);
  const { data, error } = await supabase
    .from('uniforms')
    .update(uniformData)
    .eq('id', id)
    .select();

  if (error) {
    console.error("Erro ao atualizar uniform:", error);
    throw error;
  }
  
  return data;
}

export async function deleteUniform(id: string) {
  console.log(`Excluindo uniform ${id}`);
  const { error } = await supabase
    .from('uniforms')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Erro ao excluir uniform:", error);
    throw error;
  }
  
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
