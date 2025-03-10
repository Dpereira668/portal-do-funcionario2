import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import * as Sentry from "@sentry/react";
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
import RelatoriosIndex from "./pages/dashboard/admin/relatorios/Index";
import CargosIndex from "./pages/dashboard/admin/cargos/Index";
import UnidadesIndex from "./pages/dashboard/admin/unidades/Index";
import ConvitesIndex from "./pages/dashboard/admin/convites/Index";
import AuditoriaIndex from "./pages/dashboard/admin/auditoria/Index";
import SolicitacoesDoFuncionario from "./pages/dashboard/funcionarios/solicitacoes/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./contexts/auth";
import { AccessibilityAssistant } from "./components/AccessibilityAssistant";
import withErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <AccessibilityAssistant />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<PrivateRoute />}>
            <Route path="/funcionario" element={<FuncionarioLayout />}>
              <Route index element={<Navigate to="/funcionario/solicitacoes" replace />} />
              <Route path="solicitacoes" element={<SolicitacoesDoFuncionario />} />
            </Route>
          </Route>

          <Route element={<PrivateRoute requiredRole="admin" />}>
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
              <Route path="relatorios" element={<RelatoriosIndex />} />
              <Route path="cargos" element={<CargosIndex />} />
              <Route path="unidades" element={<UnidadesIndex />} />
              <Route path="convites" element={<ConvitesIndex />} />
              <Route path="auditoria" element={<AuditoriaIndex />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </QueryClientProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default withErrorBoundary(App);
