
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Calendar, FileText, PiggyBank, Shirt } from "lucide-react";

interface SolicitacoesBotoesProps {
  onSolicitacaoClick: (tipo: string) => void;
}

const SolicitacoesBotoes = ({ onSolicitacaoClick }: SolicitacoesBotoesProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 p-2 sm:p-0 sm:gap-4 lg:grid-cols-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            onClick={() => onSolicitacaoClick('uniforme')}
            className="w-full h-[80px] sm:h-auto flex-col sm:flex-row gap-2 sm:gap-3 bg-[#8B5CF6] hover:bg-[#7C3AED] transition-colors"
          >
            <Shirt className="h-6 w-6 sm:h-5 sm:w-5" />
            <span className="text-center text-sm sm:text-base">Solicitar Uniforme</span>
          </Button>
        </SheetTrigger>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button 
            onClick={() => onSolicitacaoClick('ferias')}
            className="w-full h-[80px] sm:h-auto flex-col sm:flex-row gap-2 sm:gap-3 bg-[#F97316] hover:bg-[#EA580C] transition-colors"
          >
            <Calendar className="h-6 w-6 sm:h-5 sm:w-5" />
            <span className="text-center text-sm sm:text-base">Solicitar Férias</span>
          </Button>
        </SheetTrigger>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button 
            onClick={() => onSolicitacaoClick('documento')}
            className="w-full h-[80px] sm:h-auto flex-col sm:flex-row gap-2 sm:gap-3 bg-[#0EA5E9] hover:bg-[#0284C7] transition-colors"
          >
            <FileText className="h-6 w-6 sm:h-5 sm:w-5" />
            <span className="text-center text-sm sm:text-base">Solicitar Documento</span>
          </Button>
        </SheetTrigger>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button 
            onClick={() => onSolicitacaoClick('adiantamento')}
            className="w-full h-[80px] sm:h-auto flex-col sm:flex-row gap-2 sm:gap-3 bg-[#10B981] hover:bg-[#059669] transition-colors"
          >
            <PiggyBank className="h-6 w-6 sm:h-5 sm:w-5" />
            <span className="text-center text-sm sm:text-base">Solicitar Adiantamento</span>
          </Button>
        </SheetTrigger>
      </Sheet>
    </div>
  );
};

export default SolicitacoesBotoes;
