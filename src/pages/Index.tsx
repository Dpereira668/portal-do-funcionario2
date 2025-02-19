
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary/20 p-4">
      <Card className="w-full max-w-md animate-fadeIn">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-primary">
            Sistema de Gestão de Solicitações
          </CardTitle>
          <CardDescription className="text-center">
            Sistema em desenvolvimento. Em breve você poderá acessar todas as funcionalidades.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <p>🚧 Em construção 🚧</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
