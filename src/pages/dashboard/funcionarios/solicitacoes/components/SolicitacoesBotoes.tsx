
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Calendar, FileText, PiggyBank, Shirt } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SolicitacoesBotoesProps {
  onSolicitacaoClick: (tipo: string) => void;
}

const SolicitacoesBotoes = ({ onSolicitacaoClick }: SolicitacoesBotoesProps) => {
  const isMobile = useIsMobile();

  const buttons = [
    {
      tipo: 'uniforme',
      texto: 'Solicitar Uniforme',
      icone: Shirt,
      cor: 'bg-[#8B5CF6] hover:bg-[#7C3AED]'
    },
    {
      tipo: 'ferias',
      texto: 'Solicitar Férias',
      icone: Calendar,
      cor: 'bg-[#F97316] hover:bg-[#EA580C]'
    },
    {
      tipo: 'documento',
      texto: 'Solicitar Documento',
      icone: FileText,
      cor: 'bg-[#0EA5E9] hover:bg-[#0284C7]'
    },
    {
      tipo: 'adiantamento',
      texto: 'Solicitar Adiantamento',
      icone: PiggyBank,
      cor: 'bg-[#10B981] hover:bg-[#059669]'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-4 md:px-0">
      {buttons.map((button) => (
        <Sheet key={button.tipo}>
          <SheetTrigger asChild>
            <Button 
              onClick={() => onSolicitacaoClick(button.tipo)}
              className={`w-full h-[80px] md:h-auto flex-col md:flex-row gap-2 md:gap-3 transition-colors ${button.cor}`}
            >
              <button.icone className="h-6 w-6 md:h-5 md:w-5" />
              <span className="text-center text-sm md:text-base">
                {isMobile ? button.texto.split(' ')[1] : button.texto}
              </span>
            </Button>
          </SheetTrigger>
        </Sheet>
      ))}
    </div>
  );
};

export default SolicitacoesBotoes;

