
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
);

const PrivateRoute = () => {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  const profileQuery = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Erro ao carregar perfil",
          description: "Houve um problema ao carregar suas informações",
          variant: "destructive",
        });
        return null;
      }
      return data;
    },
    enabled: !!user,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });

  const role = profileQuery.data?.role;
  const path = location.pathname;

  useEffect(() => {
    if (path.startsWith('/admin') && role !== 'admin' && !profileQuery.isLoading && !authLoading) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar a área administrativa",
        variant: "destructive",
      });
    }
  }, [path, role, profileQuery.isLoading, authLoading, toast]);

  // Handle loading states
  if (authLoading || (user && profileQuery.isLoading)) {
    return <LoadingSpinner />;
  }

  // Handle unauthenticated users
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Handle auth pages
  if (path === '/login' || path === '/cadastro') {
    return <Navigate to={role === 'admin' ? '/admin/solicitacoes' : '/funcionario/solicitacoes'} replace />;
  }

  // Handle admin routes
  if (path.startsWith('/admin') && role !== 'admin') {
    return <Navigate to="/funcionario/solicitacoes" replace />;
  }

  // Handle funcionario routes when user is admin
  if (path.startsWith('/funcionario') && role === 'admin') {
    return <Navigate to="/admin/solicitacoes" replace />;
  }

  // If we're at root path, redirect based on role
  if (path === '/') {
    return <Navigate to={role === 'admin' ? '/admin/solicitacoes' : '/funcionario/solicitacoes'} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
