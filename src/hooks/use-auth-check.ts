
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from './use-toast';
import { useNavigate } from 'react-router-dom';

interface Profile {
  id: string;
  role: string;
  user_type: string;
  name: string | null;
  email: string | null;
  cpf: string | null;
  phone: string | null;
  address: string | null;
  birth_date: string | null;
  admission_date: string | null;
  position_id: string | null;
  workplace_id: string | null;
}

export const useAuthCheck = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("Erro de autenticação:", authError);
        toast({
          title: "Não autenticado",
          description: "Você precisa estar logado para realizar esta ação",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError || !profileData) {
        console.error("Erro ao carregar perfil:", profileError);
        toast({
          title: "Erro ao carregar perfil",
          description: "Não foi possível carregar seus dados de perfil",
          variant: "destructive",
        });
        return;
      }

      setProfile(profileData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      toast({
        title: "Erro de autenticação",
        description: "Ocorreu um erro ao verificar sua autenticação",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isAuthenticated,
    profile,
    checkAuth
  };
};

