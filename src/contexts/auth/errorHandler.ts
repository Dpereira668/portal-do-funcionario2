
import { AuthError } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import * as Sentry from '@sentry/react';

export function handleAuthError(error: AuthError, action: string) {
  const { toast } = useToast();
  
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

  Sentry.captureException(error, {
    tags: {
      auth_action: action
    }
  });

  throw error;
}
