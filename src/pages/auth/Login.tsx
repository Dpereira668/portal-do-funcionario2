
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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
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
    } catch (error: any) {
      console.error("Login error:", error);
      // Error is already handled in the signIn function
    } finally {
      setSubmitting(false);
    }
  };

  // Add keyboard navigation for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.currentTarget.id === 'email') {
        const passwordInput = document.getElementById('password');
        passwordInput?.focus();
      }
    }
  };

  // Se o usuário estiver autenticado, redireciona direto para a área administrativa
  if (user) {
    console.log("User authenticated, redirecting to admin");
    return <Navigate to="/admin/solicitacoes" replace />;
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4"
      role="main"
      aria-labelledby="login-title"
    >
      <Card className="w-full max-w-md">
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
