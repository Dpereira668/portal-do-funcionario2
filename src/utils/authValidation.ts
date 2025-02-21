
import { useToast } from "@/hooks/use-toast";
import { ADMIN_PASSWORD } from "@/constants/auth";

interface ValidationProps {
  email: string;
  password: string;
  confirmPassword: string;
  cpf: string;
  showAdminField: boolean;
  adminPassword: string;
}

export const useAuthValidation = () => {
  const { toast } = useToast();

  const validateForm = ({
    email,
    password,
    confirmPassword,
    cpf,
    showAdminField,
    adminPassword,
  }: ValidationProps): boolean => {
    if (!email || !password || !confirmPassword || !cpf) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return false;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Senhas diferentes",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return false;
    }

    if (showAdminField && adminPassword !== ADMIN_PASSWORD) {
      toast({
        title: "Senha administrativa incorreta",
        description: "A senha administrativa fornecida está incorreta",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  return { validateForm };
};
