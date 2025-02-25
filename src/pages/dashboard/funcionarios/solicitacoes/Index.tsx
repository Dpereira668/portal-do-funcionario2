
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
import { Calendar, FileText, Coffee, Shirt } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";

const SolicitacoesDoFuncionario = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [tipoSolicitacao, setTipoSolicitacao] = useState("");
  const isMobile = useIsMobile();

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

  const MobileRequestCard = ({ solicitacao }: { solicitacao: typeof minhasSolicitacoes[0] }) => (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-2">
          <solicitacao.icon className="h-5 w-5 text-primary" />
          <span className="font-medium">{solicitacao.tipo}</span>
        </div>
        <div className="space-y-2 text-sm">
          <p className="text-muted-foreground">Data: {solicitacao.data}</p>
          <p>{solicitacao.detalhes}</p>
          <p className={`font-medium ${getStatusColor(solicitacao.status)}`}>
            Status: {solicitacao.status}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <SolicitacaoHeader 
        title="Minhas Solicitações"
        subtitle="Gerencie suas solicitações e acompanhe o status"
      />

      <SolicitacoesBotoes onSolicitacaoClick={handleOpenSheet} />

      {isMobile ? (
        <div className="mt-6 px-4">
          {minhasSolicitacoes.map((solicitacao) => (
            <MobileRequestCard key={solicitacao.id} solicitacao={solicitacao} />
          ))}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden mt-8">
          <ScrollArea className="h-[calc(100vh-300px)]">
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
      )}

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="sm:max-w-[425px]">
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

