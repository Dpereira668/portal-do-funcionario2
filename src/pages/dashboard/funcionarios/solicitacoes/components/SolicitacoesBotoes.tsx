
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Calendar, FileText, PiggyBank, Shirt } from "lucide-react";

interface SolicitacoesBotoesProps {
  onSolicitacaoClick: (tipo: string) => void;
}

const SolicitacoesBotoes = ({ onSolicitacaoClick }: SolicitacoesBotoesProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            onClick={() => onSolicitacaoClick('uniforme')}
            className="w-full md:max-w-[300px] lg:w-full bg-[#8B5CF6] hover:bg-[#7C3AED] transition-colors"
          >
            <Shirt className="mr-2 h-5 w-5" />
            Solicitar Uniforme
          </Button>
        </SheetTrigger>
      </Sheet>
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            onClick={() => onSolicitacaoClick('ferias')}
            className="w-full md:max-w-[300px] lg:w-full bg-[#F97316] hover:bg-[#EA580C] transition-colors"
          >
            <Calendar className="mr-2 h-5 w-5" />
            Solicitar Férias
          </Button>
        </SheetTrigger>
      </Sheet>
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            onClick={() => onSolicitacaoClick('documento')}
            className="w-full md:max-w-[300px] lg:w-full bg-[#0EA5E9] hover:bg-[#0284C7] transition-colors"
          >
            <FileText className="mr-2 h-5 w-5" />
            Solicitar Documento
          </Button>
        </SheetTrigger>
      </Sheet>
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            onClick={() => onSolicitacaoClick('adiantamento')}
            className="w-full md:max-w-[300px] lg:w-full bg-[#10B981] hover:bg-[#059669] transition-colors"
          >
            <PiggyBank className="mr-2 h-5 w-5" />
            Solicitar Adiantamento
          </Button>
        </SheetTrigger>
      </Sheet>
    </div>
  );
};

export default SolicitacoesBotoes;
