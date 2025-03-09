
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import * as Sentry from '@sentry/react';

const LoadingSpinner = () => (
  <div className="min-h-screen flex flex-col items-center justify-center">
    <Loader2 className="h-10 w-10 animate-spin text-primary" />
    <p className="mt-4 text-muted-foreground">Carregando...</p>
  </div>
);

interface PrivateRouteProps {
  requiredRole?: string;
}

const PrivateRoute = ({ requiredRole }: PrivateRouteProps = {}) => {
  const { user, loading: authLoading, checkPermission } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  // Handle loading states first
  if (authLoading) {
    return <LoadingSpinner />;
  }

  // Handle unauthenticated users
  if (!user) {
    console.log("Redirecting to login - no user");
    
    // Track authentication failure in Sentry
    Sentry.addBreadcrumb({
      category: 'auth',
      message: 'Unauthenticated access attempt',
      level: 'warning',
      data: {
        path: location.pathname
      }
    });
    
    toast({
      title: "Acesso restrito",
      description: "Você precisa estar logado para acessar esta página.",
      variant: "destructive",
    });
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check for role-based permissions if required
  if (requiredRole && !checkPermission(requiredRole)) {
    console.log(`User doesn't have required role: ${requiredRole}`);
    
    // Track permission failure in Sentry
    Sentry.addBreadcrumb({
      category: 'auth',
      message: 'Permission denied',
      level: 'warning',
      data: {
        requiredRole,
        path: location.pathname
      }
    });
    
    toast({
      title: "Acesso negado",
      description: "Você não tem permissão para acessar esta página.",
      variant: "destructive",
    });
    return <Navigate to="/funcionario/solicitacoes" replace />;
  }

  // Handle root path
  if (location.pathname === '/') {
    console.log("Redirecting from root to appropriate dashboard");
    
    // Check if user is admin and redirect to appropriate page
    if (checkPermission('admin')) {
      return <Navigate to="/admin/solicitacoes" replace />;
    } else {
      return <Navigate to="/funcionario/solicitacoes" replace />;
    }
  }

  // Handle auth pages when user is already authenticated
  if (location.pathname === '/login' || location.pathname === '/cadastro') {
    console.log("Redirecting from auth page to appropriate dashboard");
    
    // Check if user is admin and redirect to appropriate page
    if (checkPermission('admin')) {
      return <Navigate to="/admin/solicitacoes" replace />;
    } else {
      return <Navigate to="/funcionario/solicitacoes" replace />;
    }
  }

  // Track successful access in Sentry
  Sentry.addBreadcrumb({
    category: 'navigation',
    message: 'Authorized access',
    level: 'info',
    data: {
      path: location.pathname
    }
  });

  return <Outlet />;
};

export default PrivateRoute;
