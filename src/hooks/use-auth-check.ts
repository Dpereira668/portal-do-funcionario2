
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function useAuthCheck() {
  const { user, loading } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      setIsAuthenticated(!!user);
      setIsLoading(false);
    }
  }, [user, loading]);

  return { isAuthenticated, isLoading };
}
