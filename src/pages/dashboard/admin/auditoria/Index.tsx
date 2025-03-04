
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { FileDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getAuditLogs } from "@/services/auditLogService";

const AuditoriaIndex = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState({
    resourceType: "",
    searchTerm: ""
  });

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const logsData = await getAuditLogs(
        filter.resourceType || undefined,
        undefined,
        100
      );
      
      // Apply search filter if there is a search term
      let filteredLogs = logsData;
      if (filter.searchTerm) {
        const term = filter.searchTerm.toLowerCase();
        filteredLogs = logsData.filter(log => 
          log.action.toLowerCase().includes(term) ||
          log.resource_type.toLowerCase().includes(term) ||
          (log.resource_id && log.resource_id.toLowerCase().includes(term)) ||
          (log.user_id && log.user_id.toLowerCase().includes(term))
        );
      }
      
      setLogs(filteredLogs);
    } catch (error) {
      console.error("Erro ao buscar logs de auditoria:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filter.resourceType]);

  const handleSearch = () => {
    fetchLogs();
  };

  const exportToCSV = () => {
    if (!logs.length) return;

    const headers = ['Data', 'Usuário', 'Ação', 'Tipo de Recurso', 'ID do Recurso', 'Detalhes'];
    const csvContent = [
      headers.join(','),
      ...logs.map(log => [
        format(new Date(log.created_at), "dd/MM/yyyy HH:mm"),
        log.user_id,
        log.action,
        log.resource_type,
        log.resource_id || '',
        JSON.stringify(log.details || '').replace(/,/g, ' ')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `logs_auditoria_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Format the JSON details object for display
  const formatDetails = (details: any) => {
    if (!details) return "-";
    
    try {
      return typeof details === 'object' 
        ? JSON.stringify(details, null, 2)
        : details.toString();
    } catch (e) {
      return String(details);
    }
  };

  return (
    <ScrollArea className="h-screen">
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-primary">Logs de Auditoria</h2>
            <p className="text-muted-foreground">
              Registro de ações realizadas pelos usuários no sistema
            </p>
          </div>
          <Button variant="outline" onClick={exportToCSV}>
            <FileDown className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/3">
            <Select 
              value={filter.resourceType} 
              onValueChange={(value) => setFilter(prev => ({ ...prev, resourceType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por tipo de recurso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os recursos</SelectItem>
                <SelectItem value="uniform">Uniformes</SelectItem>
                <SelectItem value="request">Solicitações</SelectItem>
                <SelectItem value="uniform_request">Solicitações de Uniforme</SelectItem>
                <SelectItem value="user">Usuários</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex w-full md:w-2/3 gap-2">
            <Input
              placeholder="Buscar por ação, usuário ou ID..."
              value={filter.searchTerm}
              onChange={(e) => setFilter(prev => ({ ...prev, searchTerm: e.target.value }))}
              className="flex-1"
            />
            <Button variant="secondary" onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Tipo de Recurso</TableHead>
                <TableHead>ID do Recurso</TableHead>
                <TableHead className="w-1/4">Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Carregando logs...
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Nenhum log encontrado
                  </TableCell>
                </TableRow>
              ) : (
                logs.slice(page * 10, (page + 1) * 10).map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {format(new Date(log.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </TableCell>
                    <TableCell>{log.user_id}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        log.action === 'create' ? 'bg-green-100 text-green-800' :
                        log.action === 'update' || log.action === 'update_status' ? 'bg-blue-100 text-blue-800' :
                        log.action === 'delete' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {log.action === 'create' ? 'Criação' :
                         log.action === 'update' ? 'Atualização' :
                         log.action === 'update_status' ? 'Mudança de Status' :
                         log.action === 'delete' ? 'Exclusão' :
                         log.action}
                      </span>
                    </TableCell>
                    <TableCell>
                      {log.resource_type === 'uniform' ? 'Uniforme' :
                       log.resource_type === 'request' ? 'Solicitação' :
                       log.resource_type === 'uniform_request' ? 'Solicitação de Uniforme' :
                       log.resource_type === 'user' ? 'Usuário' :
                       log.resource_type}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {log.resource_id || "-"}
                    </TableCell>
                    <TableCell>
                      <details>
                        <summary className="cursor-pointer text-sm text-blue-600">
                          Ver detalhes
                        </summary>
                        <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-x-auto max-h-32">
                          {formatDetails(log.details)}
                        </pre>
                      </details>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {logs.length > 10 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 0) setPage(page - 1);
                  }}
                  className={page === 0 ? "opacity-50 pointer-events-none" : ""}
                />
              </PaginationItem>
              
              <PaginationItem>
                <span className="px-4">
                  Página {page + 1} de {Math.ceil(logs.length / 10)}
                </span>
              </PaginationItem>
              
              <PaginationItem>
                <PaginationNext 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if ((page + 1) * 10 < logs.length) setPage(page + 1);
                  }}
                  className={(page + 1) * 10 >= logs.length ? "opacity-50 pointer-events-none" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </ScrollArea>
  );
};

export default AuditoriaIndex;
