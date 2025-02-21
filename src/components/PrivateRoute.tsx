
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
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      return data;
    },
    enabled: !!user,
    gcTime: 60000,
    staleTime: 30000,
    retry: false,
  });

  // Handle initial loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If authenticated but profile is loading, show loading state
  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const userRole = profile?.role;
  const path = location.pathname;

  // Handle auth routes when logged in
  if (path === '/login' || path === '/cadastro') {
    if (!userRole) {
      return <Navigate to="/funcionario/solicitacoes" replace />;
    }
    return <Navigate to={userRole === 'admin' ? '/admin/solicitacoes' : '/funcionario/solicitacoes'} replace />;
  }

  // Handle role-based routing
  if (!userRole) {
    // If no role is set, default to funcionario routes
    if (path.startsWith('/admin')) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar a área administrativa",
        variant: "destructive",
      });
      return <Navigate to="/funcionario/solicitacoes" replace />;
    }
  } else {
    // Handle admin routes
    if (path.startsWith('/admin') && userRole !== 'admin') {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar a área administrativa",
        variant: "destructive",
      });
      return <Navigate to="/funcionario/solicitacoes" replace />;
    }

    // Handle funcionario routes
    if (path.startsWith('/funcionario') && userRole === 'admin') {
      return <Navigate to="/admin/solicitacoes" replace />;
    }
  }

  return <Outlet />;
};

export default PrivateRoute;
