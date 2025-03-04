
import { create } from 'zustand';
import { Uniform } from '@/pages/dashboard/admin/uniformes/types';
import { getUniforms, addUniform, updateUniform, deleteUniform } from '@/services/uniformService';

interface UniformState {
  uniforms: Uniform[];
  loading: boolean;
  error: string | null;
  fetchUniforms: () => Promise<void>;
  addUniform: (data: Omit<Uniform, "id" | "created_at" | "updated_at">) => Promise<void>;
  updateUniform: (id: string, data: Partial<Uniform>) => Promise<void>;
  deleteUniform: (id: string) => Promise<void>;
}

export const useUniformStore = create<UniformState>((set) => ({
  uniforms: [],
  loading: false,
  error: null,
  
  fetchUniforms: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getUniforms();
      set({ uniforms: data, loading: false });
      console.log("Uniforms carregados no estado:", data.length);
    } catch (error: any) {
      set({ error: error.message, loading: false });
      console.error("Erro ao carregar uniforms no estado:", error);
    }
  },
  
  addUniform: async (uniformData) => {
    set({ loading: true, error: null });
    try {
      await addUniform(uniformData);
      const updatedUniforms = await getUniforms();
      set({ uniforms: updatedUniforms, loading: false });
      console.log("Uniform adicionado e estado atualizado");
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  
  updateUniform: async (id, uniformData) => {
    set({ loading: true, error: null });
    try {
      await updateUniform(id, uniformData);
      const updatedUniforms = await getUniforms();
      set({ uniforms: updatedUniforms, loading: false });
      console.log("Uniform atualizado e estado atualizado");
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  
  deleteUniform: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteUniform(id);
      set(state => ({ 
        uniforms: state.uniforms.filter(uniform => uniform.id !== id),
        loading: false 
      }));
      console.log("Uniform excluído e estado atualizado");
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
