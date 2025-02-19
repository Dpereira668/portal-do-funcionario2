
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SolicitacaoHeaderProps {
  title: string;
  subtitle: string;
}

const SolicitacaoHeader = ({ title, subtitle }: SolicitacaoHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center space-x-4 mb-6">
      <Button
        variant="outline"
        size="icon"
        onClick={() => navigate(-1)}
        className="h-10 w-10"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <div>
        <h2 className="text-3xl font-bold text-primary">{title}</h2>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
};

export default SolicitacaoHeader;
