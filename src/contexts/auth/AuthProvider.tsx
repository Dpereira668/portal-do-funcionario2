
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Session, User } from "@supabase/supabase-js";
import * as Sentry from '@sentry/react';
import AuthContext from "./AuthContext";
import { AuthProviderProps } from "./types";
import { ensureProfile } from "./profileUtils";
import { handleAuthError } from "./errorHandler";

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Session check on app initialization:", session ? "Active session found" : "No active session");
        
        if (session?.user) {
          setSession(session);
          setUser(session.user);
          await ensureProfile(session.user, setUserProfile, setIsAdmin);
          console.log("User authenticated on init:", session.user.email);
        }
      } catch (error) {
        console.error("Error checking authentication status:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", _event, session ? "Session exists" : "No session");
      setSession(session);
      
      if (session?.user) {
        setUser(session.user);
        await ensureProfile(session.user, setUserProfile, setIsAdmin);
      } else {
        setUser(null);
        setUserProfile(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      Sentry.setUser({
        email: email
      });

      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo de volta!",
      });

    } catch (error: any) {
      handleAuthError(error, "fazer login");
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, isAdmin: boolean = false) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            is_admin: isAdmin
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Cadastro realizado com sucesso",
        description: "Verifique seu email para confirmar o cadastro.",
      });
    } catch (error: any) {
      handleAuthError(error, "criar conta");
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      setUserProfile(null);
      setIsAdmin(false);
      
      Sentry.setUser(null);
      
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado com segurança.",
      });
      
      navigate("/login");
    } catch (error: any) {
      handleAuthError(error, "sair");
    } finally {
      setLoading(false);
    }
  };

  const checkPermission = (requiredRole: string): boolean => {
    if (!user) return false;
    
    if (requiredRole === 'admin') {
      return isAdmin;
    }
    
    return userProfile?.role === requiredRole || userProfile?.user_type === requiredRole;
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        session, 
        signIn, 
        signUp, 
        signOut, 
        loading,
        userProfile,
        isAdmin,
        checkPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
