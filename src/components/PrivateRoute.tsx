
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
      console.log('Profile data:', data);
      return data;
    },
    enabled: !!user,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    staleTime: 0,
    gcTime: 0 // Substituído cacheTime por gcTime
  });

  const role = profileQuery.data?.role;
  const path = location.pathname;

  console.log('Current role:', role);
  console.log('Current path:', path);

  // Handle loading states
  if (authLoading || (user && profileQuery.isLoading)) {
    return <LoadingSpinner />;
  }

  // Handle unauthenticated users
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Force a redirect to admin routes if user is admin
  if (role === 'admin' && !path.startsWith('/admin')) {
    console.log('Force redirecting admin to admin dashboard');
    return <Navigate to="/admin/solicitacoes" replace />;
  }

  // Force a redirect to funcionario routes if user is not admin
  if (role !== 'admin' && path.startsWith('/admin')) {
    console.log('Force redirecting non-admin to funcionario dashboard');
    return <Navigate to="/funcionario/solicitacoes" replace />;
  }

  // Handle root path
  if (path === '/') {
    return <Navigate to={role === 'admin' ? '/admin/solicitacoes' : '/funcionario/solicitacoes'} replace />;
  }

  // Handle auth pages
  if (path === '/login' || path === '/cadastro') {
    return <Navigate to={role === 'admin' ? '/admin/solicitacoes' : '/funcionario/solicitacoes'} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
