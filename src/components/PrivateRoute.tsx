
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
        console.error('Error fetching profile:', error);
        return null;
      }
      return data;
    },
    enabled: !!user,
  });

  // Show loading state while checking authentication
  if (loading || isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = profile?.role || 'funcionario';
  const currentPath = location.pathname;

  // Handle admin routes
  if (currentPath.startsWith('/admin')) {
    if (userRole !== 'admin') {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar a área administrativa",
        variant: "destructive",
      });
      return <Navigate to="/funcionario/solicitacoes" replace />;
    }
  }

  // Handle employee routes
  if (currentPath.startsWith('/funcionario')) {
    if (userRole === 'admin') {
      return <Navigate to="/admin/solicitacoes" replace />;
    }
  }

  return <Outlet />;
};

export default PrivateRoute;
