
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/layout/AdminLayout";
import FuncionarioLayout from "./components/layout/FuncionarioLayout";
import SolicitacoesIndex from "./pages/dashboard/solicitacoes/Index";
import GestaoFuncionarios from "./pages/dashboard/admin/GestaoFuncionarios";
import LancamentoFaltas from "./pages/dashboard/admin/LancamentoFaltas";
import UniformesIndex from "./pages/dashboard/admin/uniformes/Index";
import DocumentosIndex from "./pages/dashboard/admin/documentos/Index";
import FinanceiroIndex from "./pages/dashboard/admin/financeiro/Index";
import FeriasIndex from "./pages/dashboard/admin/ferias/Index";
import PunicoesIndex from "./pages/dashboard/admin/punicoes/Index";
import SolicitacoesDoFuncionario from "./pages/dashboard/funcionarios/solicitacoes/Index";
import Login from "./pages/auth/Login";
import Cadastro from "./pages/auth/Cadastro";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./contexts/AuthContext";

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
              <Route index element={<Navigate to="/admin/solicitacoes" replace />} />
              <Route path="solicitacoes" element={<SolicitacoesIndex />} />
              <Route path="gestao-funcionarios" element={<GestaoFuncionarios />} />
              <Route path="lancamento-faltas" element={<LancamentoFaltas />} />
              <Route path="uniformes" element={<UniformesIndex />} />
              <Route path="documentos" element={<DocumentosIndex />} />
              <Route path="financeiro" element={<FinanceiroIndex />} />
              <Route path="ferias" element={<FeriasIndex />} />
              <Route path="punicoes" element={<PunicoesIndex />} />
            </Route>

            {/* Rotas de Funcionário */}
            <Route path="/funcionario" element={<FuncionarioLayout />}>
              <Route index element={<Navigate to="/funcionario/solicitacoes" replace />} />
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
