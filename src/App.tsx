
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/layout/AdminLayout";
import FuncionarioLayout from "./components/layout/FuncionarioLayout";
import DashboardIndex from "./pages/dashboard/Index";
import SolicitacoesIndex from "./pages/dashboard/solicitacoes/Index";
import FuncionariosIndex from "./pages/dashboard/funcionarios/Index";
import SolicitacoesDoFuncionario from "./pages/dashboard/funcionarios/solicitacoes/Index";
import Login from "./pages/auth/Login";
import Cadastro from "./pages/auth/Cadastro";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

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
              <Route index element={
                <div className="animate-fade-in">
                  <DashboardIndex />
                </div>
              } />
              <Route path="solicitacoes" element={
                <div className="animate-fade-in">
                  <SolicitacoesIndex />
                </div>
              } />
              <Route path="funcionarios" element={
                <div className="animate-fade-in">
                  <FuncionariosIndex />
                </div>
              } />
            </Route>

            {/* Rotas de Funcionário */}
            <Route path="/funcionario" element={<FuncionarioLayout />}>
              <Route index element={
                <div className="animate-fade-in">
                  <FuncionariosIndex />
                </div>
              } />
              <Route path="solicitacoes" element={
                <div className="animate-fade-in">
                  <SolicitacoesDoFuncionario />
                </div>
              } />
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
