
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Session, User, AuthError } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, isAdmin?: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  userProfile: any | null;
  isAdmin: boolean;
  checkPermission: (requiredRole: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const ensureProfile = async (user: User) => {
    console.log("Verificando existência do perfil para:", user.id);
    
    try {
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error("Erro ao verificar perfil:", fetchError);
        return;
      }

      if (!profile) {
        console.log("Perfil não encontrado, criando novo perfil...");
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{
            id: user.id,
            email: user.email,
            role: 'funcionario',
            user_type: 'funcionario'
          }]);

        if (insertError) {
          console.error("Erro ao criar perfil:", insertError);
          toast({
            title: "Erro ao criar perfil",
            description: "Não foi possível criar seu perfil. Por favor, tente novamente.",
            variant: "destructive",
          });
        } else {
          console.log("Perfil criado com sucesso");
          toast({
            title: "Perfil criado",
            description: "Seu perfil foi criado com sucesso!",
          });
          
          // Fetch the newly created profile
          const { data: newProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          setUserProfile(newProfile);
          setIsAdmin(newProfile?.role === 'admin' || newProfile?.user_type === 'admin');
        }
      } else {
        console.log("Perfil existente encontrado:", profile);
        setUserProfile(profile);
        setIsAdmin(profile.role === 'admin' || profile.user_type === 'admin');
      }
    } catch (error) {
      console.error("Erro ao processar perfil:", error);
    }
  };

  // Check for active session on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      try {
        // Check if there's an active session
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Session check on app initialization:", session ? "Active session found" : "No active session");
        
        if (session?.user) {
          setSession(session);
          setUser(session.user);
          await ensureProfile(session.user);
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

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", _event, session ? "Session exists" : "No session");
      setSession(session);
      
      if (session?.user) {
        setUser(session.user);
        await ensureProfile(session.user);
      } else {
        setUser(null);
        setUserProfile(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthError = (error: AuthError, action: string) => {
    let message = "";
    switch (error.message) {
      case "Invalid login credentials":
        message = "Email ou senha inválidos";
        break;
      case "Email not confirmed":
        message = "Por favor, confirme seu email antes de fazer login";
        break;
      case "User already registered":
        message = "Este email já está cadastrado";
        break;
      default:
        message = `Erro ao ${action}: ${error.message}`;
    }

    toast({
      title: `Erro ao ${action}`,
      description: message,
      variant: "destructive",
    });

    throw error;
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

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
      
      // Clear user state
      setUser(null);
      setSession(null);
      setUserProfile(null);
      setIsAdmin(false);
      
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
    
    // For other role checks
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
