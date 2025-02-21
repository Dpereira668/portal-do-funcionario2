
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
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
    },
    enabled: !!user,
    gcTime: 60000, // Keep in garbage collection for 1 minute
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  // Handle initial loading state
  if (loading || (user && isLoadingProfile)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    const from = location.pathname;
    return <Navigate to="/login" state={{ from }} replace />;
  }

  const userRole = profile?.role || 'funcionario';
  const path = location.pathname;

  // Handle authentication routes when already logged in
  if (path === '/login' || path === '/cadastro') {
    return <Navigate to={userRole === 'admin' ? '/admin/solicitacoes' : '/funcionario/solicitacoes'} replace />;
  }

  // Handle admin routes access
  if (path.startsWith('/admin') && userRole !== 'admin') {
    toast({
      title: "Acesso negado",
      description: "Você não tem permissão para acessar a área administrativa",
      variant: "destructive",
    });
    return <Navigate to="/funcionario/solicitacoes" replace />;
  }

  // Handle funcionario routes access for admin
  if (path.startsWith('/funcionario') && userRole === 'admin') {
    return <Navigate to="/admin/solicitacoes" replace />;
  }

  // Allow access to the route
  return <Outlet />;
};

export default PrivateRoute;
