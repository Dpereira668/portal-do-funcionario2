
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <BrowserRouter>
      <Routes>
        {/* Página Inicial */}
        <Route path="/" element={<Index />} />
        
        {/* Rotas de Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardIndex />} />
          <Route path="solicitacoes" element={<SolicitacoesIndex />} />
          <Route path="funcionarios" element={<FuncionariosIndex />} />
        </Route>

        {/* Rotas de Funcionário */}
        <Route path="/funcionario" element={<FuncionarioLayout />}>
          <Route index element={<FuncionariosIndex />} />
          <Route path="solicitacoes" element={<SolicitacoesDoFuncionario />} />
        </Route>

        {/* Página 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
