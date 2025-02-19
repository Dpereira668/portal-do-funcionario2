
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/layout/AdminLayout";
import FuncionarioLayout from "./components/layout/FuncionarioLayout";
import DashboardIndex from "./pages/dashboard/Index";
import SolicitacoesIndex from "./pages/dashboard/solicitacoes/Index";
import GestaoFuncionarios from "./pages/dashboard/admin/GestaoFuncionarios";
import SolicitacoesDoFuncionario from "./pages/dashboard/funcionarios/solicitacoes/Index";
import Login from "./pages/auth/Login";
import Cadastro from "./pages/auth/Cadastro";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./contexts/AuthContext";

// Criar uma nova instância do QueryClient fora do componente
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          {/* Rotas Protegidas */}
          <Route element={<PrivateRoute />}>
            {/* Rotas de Admin */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardIndex />} />
              <Route path="solicitacoes" element={<SolicitacoesIndex />} />
              <Route path="gestao-funcionarios" element={<GestaoFuncionarios />} />
            </Route>

            {/* Rotas de Funcionário */}
            <Route path="/funcionario" element={<FuncionarioLayout />}>
              <Route index element={<DashboardIndex />} />
              <Route path="solicitacoes" element={<SolicitacoesDoFuncionario />} />
            </Route>
          </Route>

          {/* Página 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
