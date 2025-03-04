
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
import { Link, Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signUp, user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent, isAdmin: boolean) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    if (isAdmin && adminPassword !== "lumarj1234") {
      toast({
        title: "Senha administrativa inválida",
        description: "A senha administrativa fornecida está incorreta",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      await signUp(email, password, isAdmin);
      toast({
        title: "Cadastro realizado",
        description: "Sua conta foi criada com sucesso!",
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      // Error is already handled in the signUp function
    } finally {
      setSubmitting(false);
    }
  };

  if (user) {
    return <Navigate to="/admin/solicitacoes" replace />;
  }

  if (authLoading) {
    return (
      <div 
        className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4"
        role="status"
        aria-live="polite"
      >
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
          <p className="mt-4 text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4"
      role="main"
      aria-labelledby="register-title"
    >
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold" id="register-title">Cadastro</CardTitle>
          <CardDescription>
            Crie sua conta para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="employee" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2" role="tablist" aria-label="Tipo de usuário">
              <TabsTrigger value="employee" role="tab" aria-selected="true" id="tab-employee" aria-controls="panel-employee">Funcionário</TabsTrigger>
              <TabsTrigger value="admin" role="tab" aria-selected="false" id="tab-admin" aria-controls="panel-admin">Administrador</TabsTrigger>
            </TabsList>
            
            <TabsContent value="employee" role="tabpanel" id="panel-employee" aria-labelledby="tab-employee">
              <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-employee">
                    Email <span aria-hidden="true">*</span>
                    <span className="sr-only">(obrigatório)</span>
                  </Label>
                  <Input
                    id="email-employee"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={submitting}
                    aria-required="true"
                    aria-invalid={email === ""}
                    aria-describedby="email-employee-error"
                  />
                  {email === "" && (
                    <p id="email-employee-error" className="text-sm text-red-500 hidden">
                      Por favor, preencha o campo de email.
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-employee">
                    Senha <span aria-hidden="true">*</span>
                    <span className="sr-only">(obrigatório)</span>
                  </Label>
                  <Input
                    id="password-employee"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={submitting}
                    aria-required="true"
                    aria-invalid={password === ""}
                    aria-describedby="password-employee-error"
                  />
                  {password === "" && (
                    <p id="password-employee-error" className="text-sm text-red-500 hidden">
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
                      <span>Cadastrando...</span>
                    </div>
                  ) : (
                    "Cadastrar como Funcionário"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="admin" role="tabpanel" id="panel-admin" aria-labelledby="tab-admin">
              <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-admin">Email</Label>
                  <Input
                    id="email-admin"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={submitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-admin">Senha</Label>
                  <Input
                    id="password-admin"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={submitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Senha Administrativa</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                    placeholder="Digite a senha administrativa"
                    disabled={submitting}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={submitting}
                >
                  {submitting ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Cadastrando...</span>
                    </div>
                  ) : (
                    "Cadastrar como Administrador"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          <div className="mt-4 text-center text-sm">
            <Link to="/login" className="text-primary hover:underline" aria-label="Ir para página de login">
              Já tem uma conta? Faça login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
