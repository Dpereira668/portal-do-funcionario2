
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import * as Sentry from '@sentry/react';

export function useAuthCheck() {
  const { user, loading } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      const authenticated = !!user;
      setIsAuthenticated(authenticated);
      setIsLoading(false);
      
      // Set user identity in Sentry when authenticated
      if (user) {
        Sentry.setUser({
          id: user.id,
          email: user.email,
        });
      } else {
        // Clear user data when not authenticated
        Sentry.setUser(null);
      }
    }
  }, [user, loading]);

  return { isAuthenticated, isLoading };
}
