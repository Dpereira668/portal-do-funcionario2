import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import * as Sentry from '@sentry/react';
import { supabase } from "@/lib/supabase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signIn, user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }
    
    setSubmitting(true);
    try {
      await signIn(email, password);
      console.log("Login successful");
      Sentry.addBreadcrumb({
        category: 'auth',
        message: 'Login successful',
        level: 'info',
      });
    } catch (error: any) {
      console.error("Login error:", error);
      Sentry.captureException(error, {
        tags: {
          action: 'login',
        },
        extra: {
          email: email,
        },
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      
      Sentry.addBreadcrumb({
        category: 'auth',
        message: 'Google login attempt',
        level: 'info',
      });
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/admin/solicitacoes'
        }
      });
      
      if (error) {
        console.error("Google login error:", error);
        toast({
          title: "Erro no login com Google",
          description: error.message,
          variant: "destructive",
        });
        
        Sentry.captureException(error, {
          tags: {
            action: 'google_login',
          },
        });
      }
    } catch (error: any) {
      console.error("Unexpected error during Google login:", error);
      toast({
        title: "Erro inesperado",
        description: "Não foi possível realizar o login com Google. Tente novamente.",
        variant: "destructive",
      });
      Sentry.captureException(error);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.currentTarget.id === 'email') {
        const passwordInput = document.getElementById('password');
        passwordInput?.focus();
      }
    }
  };

  if (user) {
    console.log("User authenticated, redirecting to admin");
    return <Navigate to="/admin/solicitacoes" replace />;
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4"
      role="main"
      aria-labelledby="login-title"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&q=80&w=1920')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
      }}
    >
      <Card className="w-full max-w-md backdrop-blur-sm bg-white/90">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold" id="login-title">Login Administrativo</CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {authLoading ? (
            <div className="flex justify-center items-center py-8" role="status" aria-live="polite">
              <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
              <span className="ml-2">Verificando autenticação...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
              >
                {googleLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                )}
                <span>Entrar com Google</span>
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Ou continue com</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="email">
                    Email <span aria-hidden="true">*</span>
                    <span className="sr-only">(obrigatório)</span>
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                    required
                    disabled={submitting}
                    aria-required="true"
                    aria-invalid={email === ""}
                    aria-describedby="email-error"
                  />
                  {email === "" && (
                    <p id="email-error" className="text-sm text-red-500 hidden">
                      Por favor, preencha o campo de email.
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="password">
                    Senha <span aria-hidden="true">*</span>
                    <span className="sr-only">(obrigatório)</span>
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={submitting}
                    aria-required="true"
                    aria-invalid={password === ""}
                    aria-describedby="password-error"
                  />
                  {password === "" && (
                    <p id="password-error" className="text-sm text-red-500 hidden">
                      Por favor, preencha o campo de senha.
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={submitting}
                  aria-busy={submitting}
                >
                  {submitting ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      <span>Entrando...</span>
                    </div>
                  ) : (
                    "Entrar"
                  )}
                </Button>
                <div className="text-center">
                  <Link 
                    to="/cadastro" 
                    className="text-sm text-primary hover:underline"
                    aria-label="Ir para página de cadastro"
                  >
                    Não tem uma conta? Cadastre-se
                  </Link>
                </div>
              </form>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
