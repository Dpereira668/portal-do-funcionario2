
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/auth";
import { Navigate } from "react-router-dom";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import { EmailLoginForm } from "@/components/auth/EmailLoginForm";
import { LoginDivider } from "@/components/auth/LoginDivider";
import { LoginBackground } from "@/components/auth/LoginBackground";
import { LoadingIndicator } from "@/components/auth/LoadingIndicator";

const Login = () => {
  const { user, loading: authLoading } = useAuth();

  if (user) {
    console.log("User authenticated, redirecting to funcionario");
    return <Navigate to="/funcionario/solicitacoes" replace />;
  }

  return (
    <LoginBackground>
      <Card className="w-full max-w-md backdrop-blur-sm bg-white/90">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold" id="login-title">Login Administrativo</CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {authLoading ? (
            <LoadingIndicator />
          ) : (
            <div className="space-y-4">
              <GoogleLoginButton />
              <LoginDivider />
              <EmailLoginForm />
            </div>
          )}
        </CardContent>
      </Card>
    </LoginBackground>
  );
};

export default Login;
