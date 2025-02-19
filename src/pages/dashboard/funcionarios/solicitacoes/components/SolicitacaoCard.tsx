
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface SolicitacaoCardProps {
  id: number;
  tipo: string;
  status: string;
  dataInicio: string;
  dataFim?: string;
  observacoes: string;
  detalhes?: string;
  icon: LucideIcon;
  getStatusColor: (status: string) => string;
}

const SolicitacaoCard = ({
  tipo,
  status,
  dataInicio,
  dataFim,
  observacoes,
  detalhes,
  icon: Icon,
  getStatusColor,
}: SolicitacaoCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-primary/5 rounded-full">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg font-medium">
              {tipo}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {dataInicio}
              {dataFim && dataFim !== dataInicio && ` - ${dataFim}`}
            </p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            status
          )}`}
        >
          {status}
        </span>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {observacoes}
          {detalhes && (
            <span className="block mt-2 font-medium">{detalhes}</span>
          )}
        </p>
        <div className="flex justify-end">
          <Button variant="outline" size="sm">
            Ver Detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SolicitacaoCard;
