
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type VacationSchedule } from "../types/vacations";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface VacationScheduleCardProps {
  schedule: VacationSchedule;
}

export const VacationScheduleCard = ({ schedule }: VacationScheduleCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div>
            <h3 className="text-lg font-semibold">{schedule.employee_name}</h3>
            <p className="text-sm text-muted-foreground">
              {format(new Date(schedule.start_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} - {format(new Date(schedule.end_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">
            <strong>CPF:</strong> {schedule.employee_cpf}
          </p>
          <p className="text-sm">
            <strong>Função:</strong> {schedule.position_title}
          </p>
          <p className="text-sm">
            <strong>Posto:</strong> {schedule.workplace}
          </p>
          {schedule.observation && (
            <div className="border-t pt-2 mt-2">
              <p className="text-sm">
                <strong>Observação:</strong> {schedule.observation}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
