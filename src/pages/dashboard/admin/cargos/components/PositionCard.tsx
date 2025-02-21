
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCog } from "lucide-react";
import { Position } from "../types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PositionCardProps {
  position: Position;
}

export const PositionCard = ({ position }: PositionCardProps) => {
  const formatDate = (date: string) => {
    return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCog className="h-5 w-5" />
          {position.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {position.description && (
            <div>
              <p className="text-sm text-muted-foreground">{position.description}</p>
            </div>
          )}
          <div className="text-sm text-muted-foreground">
            <p>Criado em: {formatDate(position.created_at)}</p>
            <p>Última atualização: {formatDate(position.updated_at)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
