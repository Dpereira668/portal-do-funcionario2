
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const PrivateRoute = () => {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      return data;
    },
    enabled: !!user,
    retry: false,
  });

  if (authLoading || (user && profileLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  const path = location.pathname;
  const isAuthRoute = path === '/login' || path === '/cadastro';
  const isAdminRoute = path.startsWith('/admin');
  const isFuncionarioRoute = path.startsWith('/funcionario');

  // Default role to 'funcionario' if profile is not loaded
  const role = profile?.role ?? 'funcionario';

  if (isAuthRoute) {
    return <Navigate to={role === 'admin' ? '/admin/solicitacoes' : '/funcionario/solicitacoes'} replace />;
  }

  if (isAdminRoute && role !== 'admin') {
    toast({
      title: "Acesso negado",
      description: "Você não tem permissão para acessar a área administrativa",
      variant: "destructive",
    });
    return <Navigate to="/funcionario/solicitacoes" replace />;
  }

  if (isFuncionarioRoute && role === 'admin') {
    return <Navigate to="/admin/solicitacoes" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
