
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
import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { AuthError } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const ADMIN_PASSWORD = "Lumarj2024";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminField, setShowAdminField] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    try {
      await signIn(email, password);
      
      // Verificar se é uma tentativa de acesso administrativo
      if (showAdminField && adminPassword !== ADMIN_PASSWORD) {
        toast({
          title: "Acesso negado",
          description: "Senha administrativa incorreta",
          variant: "destructive",
        });
        return;
      }
      
      // Se a senha administrativa estiver correta, o perfil será atualizado para admin
      if (showAdminField && adminPassword === ADMIN_PASSWORD) {
        const { error } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', user?.id);
          
        if (error) {
          console.error('Error updating role:', error);
          toast({
            title: "Erro ao atualizar perfil",
            description: "Não foi possível definir permissões administrativas",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Erro no login",
        description: "Verifique suas credenciais e tente novamente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // If user is already authenticated, redirect to appropriate page
  if (user) {
    const userRole = profile?.role || 'funcionario';
    const redirectPath = userRole === 'admin' ? '/admin/solicitacoes' : '/funcionario/solicitacoes';
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              />
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
              disabled={loading || !email || !password || (showAdminField && !adminPassword)}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <Link to="/cadastro" className="text-primary hover:underline">
              Não tem uma conta? Cadastre-se
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
