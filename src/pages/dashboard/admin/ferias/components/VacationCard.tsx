
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User } from "lucide-react";
import { VacationSchedule } from "../types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface VacationCardProps {
  schedule: VacationSchedule;
}

export const VacationCard = ({ schedule }: VacationCardProps) => {
  const formatDate = (date: string) => {
    return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          {schedule.employee_name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">CPF:</span>
            <span>{schedule.employee_cpf}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Cargo:</span>
            <span>{schedule.position_title}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Local:</span>
            <span>{schedule.workplace}</span>
          </div>
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 text-primary">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Período</span>
            </div>
            <div className="mt-2 text-sm">
              <p>Início: {formatDate(schedule.start_date)}</p>
              <p>Fim: {formatDate(schedule.end_date)}</p>
            </div>
          </div>
          {schedule.observation && (
            <div className="text-sm text-muted-foreground">
              <p className="font-medium">Observações:</p>
              <p>{schedule.observation}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
