
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import NovaSolicitacaoForm from "./components/NovaSolicitacaoForm";
import SolicitacaoHeader from "./components/SolicitacaoHeader";
import SolicitacoesBotoes from "./components/SolicitacoesBotoes";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, FileText, Coffee, Shirt, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const SolicitacoesDoFuncionario = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [tipoSolicitacao, setTipoSolicitacao] = useState("");

  const handleOpenSheet = (tipo: string) => {
    setTipoSolicitacao(tipo);
    setIsSheetOpen(true);
  };

  // Dados de exemplo para demonstração
  const minhasSolicitacoes = [
    {
      id: 1,
      tipo: "Uniforme",
      status: "Pendente",
      data: "15/04/2024",
      detalhes: "Camisa social - Tamanho M - 2 unidades",
      icon: Shirt,
    },
    {
      id: 2,
      tipo: "Férias",
      status: "Aprovado",
      data: "12/04/2024",
      detalhes: "Período: 15/05/2024 a 30/05/2024",
      icon: Calendar,
    },
    {
      id: 3,
      tipo: "Documento",
      status: "Rejeitado",
      data: "10/04/2024",
      detalhes: "Declaração de vínculo empregatício",
      icon: FileText,
    },
    {
      id: 4,
      tipo: "Outros",
      status: "Pendente",
      data: "08/04/2024",
      detalhes: "Solicitação de mudança de horário",
      icon: Coffee,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovado":
        return "text-green-600";
      case "Rejeitado":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  return (
    <div className="p-8 space-y-6">
      <SolicitacaoHeader 
        title="Minhas Solicitações"
        subtitle="Gerencie suas solicitações e acompanhe o status"
      />

      <SolicitacoesBotoes onSolicitacaoClick={handleOpenSheet} />

      <div className="border rounded-lg overflow-hidden mt-8">
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-[200px]">Tipo</TableHead>
                <TableHead className="w-[120px]">Data</TableHead>
                <TableHead className="min-w-[300px]">Detalhes</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {minhasSolicitacoes.map((solicitacao) => (
                <TableRow key={solicitacao.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <solicitacao.icon className="h-4 w-4 text-primary" />
                      {solicitacao.tipo}
                    </div>
                  </TableCell>
                  <TableCell>{solicitacao.data}</TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {solicitacao.detalhes}
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${getStatusColor(solicitacao.status)}`}>
                      {solicitacao.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-[425px]">
          <SheetHeader>
            <SheetTitle>Nova Solicitação</SheetTitle>
            <SheetDescription>
              Preencha os dados para criar uma nova solicitação
            </SheetDescription>
          </SheetHeader>
          <NovaSolicitacaoForm 
            tipoInicial={tipoSolicitacao}
            onSuccess={() => setIsSheetOpen(false)} 
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SolicitacoesDoFuncionario;
