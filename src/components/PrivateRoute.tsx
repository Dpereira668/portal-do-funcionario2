
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useMemo } from "react";

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
        return null;
      }
      return data;
    },
    enabled: !!user,
    staleTime: 300000, // 5 minutes
    cacheTime: 300000, // 5 minutes
    retry: false,
    refetchOnWindowFocus: false,
  });

  const role = useMemo(() => profileQuery.data?.role ?? 'funcionario', [profileQuery.data]);

  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (profileQuery.isLoading) {
    return <LoadingSpinner />;
  }

  const path = location.pathname;

  if (path === '/login' || path === '/cadastro') {
    const redirectPath = role === 'admin' ? '/admin/solicitacoes' : '/funcionario/solicitacoes';
    return <Navigate to={redirectPath} replace />;
  }

  // Verify admin access
  if (path.startsWith('/admin') && role !== 'admin') {
    toast({
      title: "Acesso negado",
      description: "Você não tem permissão para acessar a área administrativa",
      variant: "destructive",
    });
    return <Navigate to="/funcionario/solicitacoes" replace />;
  }

  // Verify funcionario access
  if (path.startsWith('/funcionario') && role === 'admin') {
    return <Navigate to="/admin/solicitacoes" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
