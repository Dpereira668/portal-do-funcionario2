
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { Workplace } from "../types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface WorkplaceCardProps {
  workplace: Workplace;
}

export const WorkplaceCard = ({ workplace }: WorkplaceCardProps) => {
  const formatDate = (date: string) => {
    return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          {workplace.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {workplace.address && (
            <div>
              <p className="text-sm text-muted-foreground">{workplace.address}</p>
            </div>
          )}
          <div className="text-sm text-muted-foreground">
            <p>Criado em: {formatDate(workplace.created_at)}</p>
            <p>Última atualização: {formatDate(workplace.updated_at)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
