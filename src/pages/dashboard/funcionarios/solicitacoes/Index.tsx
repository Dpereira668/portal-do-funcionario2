
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

const SolicitacoesDoFuncionario = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [tipoSolicitacao, setTipoSolicitacao] = useState("");

  const handleOpenSheet = (tipo: string) => {
    setTipoSolicitacao(tipo);
    setIsSheetOpen(true);
  };

  return (
    <div className="p-8 space-y-6">
      <SolicitacaoHeader 
        title="Minhas Solicitações"
        subtitle="Gerencie suas solicitações e acompanhe o status"
      />

      <SolicitacoesBotoes onSolicitacaoClick={handleOpenSheet} />

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
