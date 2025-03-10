
import { create } from 'zustand';
import { createUniformRequests, createRequest, getUserRequests, getAllRequests, updateRequestStatus } from '@/services/requestService';

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

interface RequestState {
  requests: any[];
  loading: boolean;
  error: string | null;
  fetchUserRequests: (userId: string) => Promise<void>;
  fetchAllRequests: () => Promise<void>;
  createUniformRequests: (userId: string, items: UniformRequestItem[], notes?: string) => Promise<void>;
  createRequest: (data: RequestData) => Promise<void>;
  updateRequestStatus: (id: string, status: string, userId: string) => Promise<void>;
}

export const useRequestStore = create<RequestState>((set) => {
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
    requests: [],
    loading: false,
    error: null,
    
    fetchUserRequests: async (userId) => {
      set({ loading: true, error: null });
      try {
        const data = await getUserRequests(userId);
        set({ requests: data, loading: false });
        console.log("Solicitações do usuário carregadas no estado:", data.length);
      } catch (error: any) {
        set({ error: error.message, loading: false });
        console.error("Erro ao carregar solicitações no estado:", error);
      }
    },
    
    fetchAllRequests: async () => {
      set({ loading: true, error: null });
      try {
        const data = await getAllRequests();
        set({ requests: data, loading: false });
        console.log("Todas as solicitações carregadas no estado:", data.length);
      } catch (error: any) {
        set({ error: error.message, loading: false });
        console.error("Erro ao carregar solicitações no estado:", error);
      }
    },
    
    createUniformRequests: async (userId, items, notes) => {
      set({ loading: true, error: null });
      try {
        await createUniformRequests(userId, items, notes);
        const data = await getUserRequests(userId);
        set({ requests: data, loading: false });
        console.log("Solicitações de uniforme criadas e estado atualizado");
      } catch (error: any) {
        set({ error: error.message, loading: false });
      }
    },
    
    createRequest: async (requestData) => {
      set({ loading: true, error: null });
      try {
        await createRequest(requestData);
        const data = await getUserRequests(requestData.user_id);
        set({ requests: data, loading: false });
        console.log("Solicitação criada e estado atualizado");
      } catch (error: any) {
        set({ error: error.message, loading: false });
      }
    },
    
    updateRequestStatus: async (id, status) => {
      set({ loading: true, error: null });
      try {
        const userId = currentUser?.id || 'anonymous';
        await updateRequestStatus(id, status, userId);
        set(state => ({
          requests: state.requests.map(req => 
            req.id === id ? { ...req, status } : req
          ),
          loading: false
        }));
        console.log("Status da solicitação atualizado e estado atualizado");
      } catch (error: any) {
        set({ error: error.message, loading: false });
      }
    },
  };
});
