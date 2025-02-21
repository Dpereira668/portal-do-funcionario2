
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
);

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
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  // Handle loading states
  if (authLoading || profileLoading) {
    return <LoadingSpinner />;
  }

  // Handle unauthenticated users
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Handle root path and redirect based on role
  if (location.pathname === '/') {
    return <Navigate to={profile?.role === 'admin' ? '/admin/solicitacoes' : '/funcionario/solicitacoes'} replace />;
  }

  // Handle auth pages when user is already authenticated
  if (location.pathname === '/login' || location.pathname === '/cadastro') {
    return <Navigate to={profile?.role === 'admin' ? '/admin/solicitacoes' : '/funcionario/solicitacoes'} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
