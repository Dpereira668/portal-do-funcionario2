
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const ensureProfile = async (user: User) => {
    console.log("Verificando existência do perfil para:", user.id);
    
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
      }
    } else {
      console.log("Perfil existente encontrado:", profile);
    }
  };

  useEffect(() => {
    // Fetch initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session fetch:", session);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        ensureProfile(session.user);
      }
      setLoading(false);
    });

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", session);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await ensureProfile(session.user);
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
        message = `Erro ao ${action}`;
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
    }
  };

  const signUp = async (email: string, password: string, isAdmin: boolean = false) => {
    try {
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
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/login");
    } catch (error: any) {
      handleAuthError(error, "sair");
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, signIn, signUp, signOut, loading }}>
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
