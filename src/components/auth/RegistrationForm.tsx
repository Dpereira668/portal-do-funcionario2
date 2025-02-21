
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuthValidation } from "@/utils/authValidation";
import { ADMIN_PASSWORD } from "@/constants/auth";

export const RegistrationForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cpf, setCpf] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminField, setShowAdminField] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();
  const { validateForm } = useAuthValidation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateForm({
      email,
      password,
      confirmPassword,
      cpf,
      showAdminField,
      adminPassword,
    });

    if (!isValid) return;

    setLoading(true);
    try {
      await signUp(email, password);
      
      if (showAdminField && adminPassword === ADMIN_PASSWORD) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', user.id);
            
          if (error) {
            console.error('Error updating role:', error);
            toast({
              title: "Erro ao configurar perfil administrativo",
              description: "Houve um problema ao definir as permissões administrativas",
              variant: "destructive",
            });
          }
        }
      }
      
      toast({
        title: "Cadastro realizado",
        description: "Sua conta foi criada com sucesso!",
      });
    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="cpf">
          CPF
        </label>
        <Input
          id="cpf"
          value={cpf}
          onChange={(e) => setCpf(e.target.value.replace(/\D/g, ""))}
          maxLength={11}
          pattern="\d{11}"
          required
          placeholder="Digite apenas números"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="email">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="password">
          Senha
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="confirmPassword">
          Confirmar Senha
        </label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
        />
        {password !== confirmPassword && confirmPassword && (
          <p className="text-sm text-destructive">As senhas não coincidem</p>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="adminAccess"
          checked={showAdminField}
          onChange={(e) => setShowAdminField(e.target.checked)}
          className="rounded border-gray-300"
        />
        <label htmlFor="adminAccess" className="text-sm">
          Acesso Administrativo
        </label>
      </div>
      {showAdminField && (
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="adminPassword">
            Senha Administrativa
          </label>
          <Input
            id="adminPassword"
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            required={showAdminField}
          />
        </div>
      )}
      <Button
        type="submit"
        className="w-full"
        disabled={
          loading ||
          !email ||
          !password ||
          !confirmPassword ||
          !cpf ||
          password !== confirmPassword ||
          (showAdminField && !adminPassword)
        }
      >
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
        ) : (
          "Cadastrar"
        )}
      </Button>
      <div className="mt-4 text-center text-sm">
        <Link to="/login" className="text-primary hover:underline">
          Já tem uma conta? Faça login
        </Link>
      </div>
    </form>
  );
};
