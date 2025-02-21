
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const PrivateRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        toast({
          title: "Erro ao carregar perfil",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      return data;
    },
    enabled: !!user,
  });

  if (loading || isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se não tiver perfil, considera como funcionário
  const userRole = profile?.role || 'funcionario';

  // Se tentar acessar área administrativa sem ser admin
  if (location.pathname.startsWith('/admin') && userRole !== 'admin') {
    toast({
      title: "Acesso negado",
      description: "Você não tem permissão para acessar a área administrativa",
      variant: "destructive",
    });
    return <Navigate to="/funcionario/solicitacoes" replace />;
  }

  // Se for admin tentando acessar área de funcionário
  if (location.pathname.startsWith('/funcionario') && userRole === 'admin') {
    return <Navigate to="/admin/solicitacoes" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
