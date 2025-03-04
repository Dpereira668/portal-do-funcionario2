
import { create } from 'zustand';
import { Uniform } from '@/pages/dashboard/admin/uniformes/types';
import { getUniforms, addUniform, updateUniform, deleteUniform } from '@/services/uniformService';
import { useAuth } from '@/contexts/AuthContext';

interface UniformState {
  uniforms: Uniform[];
  totalCount: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
  fetchUniforms: (page?: number, pageSize?: number) => Promise<void>;
  addUniform: (data: Omit<Uniform, "id" | "created_at" | "updated_at">) => Promise<void>;
  updateUniform: (id: string, data: Partial<Uniform>) => Promise<void>;
  deleteUniform: (id: string) => Promise<void>;
}

export const useUniformStore = create<UniformState>((set) => {
  // Let's store the user object in state for use in service calls
  let currentUser: any = null;
  
  try {
    // Try to get the user from local storage on store creation
    const storedAuthData = localStorage.getItem('portal_auth');
    if (storedAuthData) {
      const parsedData = JSON.parse(storedAuthData);
      if (parsedData && parsedData.user) {
        currentUser = parsedData.user;
      }
    }
  } catch (e) {
    console.error("Error reading user from local storage:", e);
  }
  
  // Update the user reference when auth state changes
  if (typeof window !== 'undefined') {
    window.addEventListener('auth-state-change', () => {
      try {
        const storedAuthData = localStorage.getItem('portal_auth');
        if (storedAuthData) {
          const parsedData = JSON.parse(storedAuthData);
          if (parsedData && parsedData.user) {
            currentUser = parsedData.user;
          }
        }
      } catch (e) {
        console.error("Error updating user reference:", e);
      }
    });
  }
  
  return {
    uniforms: [],
    totalCount: 0,
    hasMore: false,
    loading: false,
    error: null,
    
    fetchUniforms: async (page = 0, pageSize = 10) => {
      set({ loading: true, error: null });
      try {
        const result = await getUniforms(page, pageSize);
        set({ 
          uniforms: result.data, 
          totalCount: result.totalCount, 
          hasMore: result.hasMore, 
          loading: false 
        });
        console.log("Uniforms carregados no estado:", result.data.length);
      } catch (error: any) {
        set({ error: error.message, loading: false });
        console.error("Erro ao carregar uniforms no estado:", error);
      }
    },
    
    addUniform: async (uniformData) => {
      set({ loading: true, error: null });
      try {
        const userId = currentUser?.id || 'anonymous';
        await addUniform(uniformData, userId);
        const result = await getUniforms();
        set({ 
          uniforms: result.data, 
          totalCount: result.totalCount, 
          hasMore: result.hasMore, 
          loading: false 
        });
        console.log("Uniform adicionado e estado atualizado");
      } catch (error: any) {
        set({ error: error.message, loading: false });
      }
    },
    
    updateUniform: async (id, uniformData) => {
      set({ loading: true, error: null });
      try {
        const userId = currentUser?.id || 'anonymous';
        await updateUniform(id, uniformData, userId);
        const result = await getUniforms();
        set({ 
          uniforms: result.data, 
          totalCount: result.totalCount, 
          hasMore: result.hasMore, 
          loading: false 
        });
        console.log("Uniform atualizado e estado atualizado");
      } catch (error: any) {
        set({ error: error.message, loading: false });
      }
    },
    
    deleteUniform: async (id) => {
      set({ loading: true, error: null });
      try {
        const userId = currentUser?.id || 'anonymous';
        await deleteUniform(id, userId);
        set(state => ({ 
          uniforms: state.uniforms.filter(uniform => uniform.id !== id),
          loading: false 
        }));
        console.log("Uniform excluído e estado atualizado");
      } catch (error: any) {
        set({ error: error.message, loading: false });
      }
    },
  };
});
