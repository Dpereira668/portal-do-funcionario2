
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import * as Sentry from '@sentry/react';

export const EmailLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signIn } = useAuth();
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
      Sentry.addBreadcrumb({
        category: 'auth',
        message: 'Login attempt',
        level: 'info',
      });
      
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.currentTarget.id === 'email') {
        const passwordInput = document.getElementById('password');
        passwordInput?.focus();
      }
    }
  };

  return (
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
  );
};
