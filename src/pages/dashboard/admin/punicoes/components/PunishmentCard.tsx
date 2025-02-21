
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Download } from "lucide-react";
import { Punishment } from "../types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PunishmentCardProps {
  punishment: Punishment;
}

export const PunishmentCard = ({ punishment }: PunishmentCardProps) => {
  const formatDate = (date: string) => {
    return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <span className="capitalize">{punishment.type}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="font-medium">Motivo:</p>
            <p className="text-sm text-muted-foreground">{punishment.reason}</p>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Início:</span>
              <span>{formatDate(punishment.start_date)}</span>
            </div>
            {punishment.end_date && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Fim:</span>
                <span>{formatDate(punishment.end_date)}</span>
              </div>
            )}
          </div>
          {punishment.document_url && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open(punishment.document_url, '_blank')}
            >
              <Download className="mr-2 h-4 w-4" />
              Baixar Documento
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
