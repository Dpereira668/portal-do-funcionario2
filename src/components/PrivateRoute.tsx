
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

  // Handle loading state
  if (authLoading) {
    return <LoadingSpinner />;
  }

  // Handle unauthenticated users
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Handle auth pages when user is already authenticated
  if (location.pathname === '/login' || location.pathname === '/cadastro') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
