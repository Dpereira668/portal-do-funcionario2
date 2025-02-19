
interface SolicitacoesFiltrosProps {
  filtroStatus: string;
  setFiltroStatus: (status: string) => void;
  ordenacao: string;
  setOrdenacao: (ordenacao: string) => void;
}

const SolicitacoesFiltros = ({
  filtroStatus,
  setFiltroStatus,
  ordenacao,
  setOrdenacao,
}: SolicitacoesFiltrosProps) => {
  return (
    <div className="flex gap-4">
      <select
        className="p-2 border rounded-md"
        value={filtroStatus}
        onChange={(e) => setFiltroStatus(e.target.value)}
      >
        <option value="todos">Todos os Status</option>
        <option value="Pendente">Pendente</option>
        <option value="Aprovado">Aprovado</option>
        <option value="Rejeitado">Rejeitado</option>
      </select>
      <select
        className="p-2 border rounded-md"
        value={ordenacao}
        onChange={(e) => setOrdenacao(e.target.value)}
      >
        <option value="data">Ordenar por Data</option>
        <option value="status">Ordenar por Status</option>
      </select>
    </div>
  );
};

export default SolicitacoesFiltros;
