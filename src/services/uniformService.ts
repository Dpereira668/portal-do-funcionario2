
import { supabase } from "@/lib/supabase";
import { Uniform } from "@/pages/dashboard/admin/uniformes/types";

export async function getUniforms() {
  console.log("Buscando uniforms do Supabase");
  const { data, error } = await supabase
    .from('uniforms')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Erro ao buscar uniforms:", error);
    throw error;
  }
  
  return data as Uniform[];
}

export async function addUniform(uniformData: Omit<Uniform, "id" | "created_at" | "updated_at">) {
  console.log("Adicionando uniform ao Supabase:", uniformData);
  const { data, error } = await supabase
    .from('uniforms')
    .insert(uniformData);

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
    .eq('id', id);

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
