
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
    enabled: !!user,
    staleTime: 300000, // 5 minutes
    gcTime: 600000 // 10 minutes
  });

  // Handle loading states first
  if (authLoading || (user && profileLoading)) {
    return <LoadingSpinner />;
  }

  // Handle unauthenticated users
  if (!user) {
    console.log("Redirecting to login - no user");
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Handle cases where profile data is not yet available
  if (!profile && !profileLoading) {
    console.log("Redirecting to login - no profile");
    return <Navigate to="/login" replace />;
  }

  // Handle admin-only routes
  if (location.pathname.startsWith('/admin') && profile?.role !== 'admin') {
    toast({
      title: "Acesso negado",
      description: "Você não tem permissão para acessar esta área.",
      variant: "destructive",
    });
    console.log("Redirecting to funcionario/solicitacoes - not admin");
    return <Navigate to="/funcionario/solicitacoes" replace />;
  }

  // Handle root path and redirect based on role
  if (location.pathname === '/') {
    const redirectPath = profile?.role === 'admin' ? '/admin/solicitacoes' : '/funcionario/solicitacoes';
    console.log("Redirecting from root to", redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  // Handle auth pages when user is already authenticated
  if (location.pathname === '/login' || location.pathname === '/cadastro') {
    const redirectPath = profile?.role === 'admin' ? '/admin/solicitacoes' : '/funcionario/solicitacoes';
    console.log("Redirecting from auth page to", redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
