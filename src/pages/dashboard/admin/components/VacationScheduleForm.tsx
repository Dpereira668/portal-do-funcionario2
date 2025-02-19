
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface VacationScheduleFormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const VacationScheduleForm = ({
  onSubmit,
}: VacationScheduleFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nome do Funcionário</label>
          <Input name="name" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">CPF do Funcionário</label>
          <Input name="cpf" required pattern="\d{11}" maxLength={11} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Função</label>
          <Input name="position" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Posto</label>
          <Input name="workplace" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Data de Início</label>
          <Input name="start_date" type="date" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Data de Término</label>
          <Input name="end_date" type="date" required />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Observação</label>
        <Textarea name="observation" />
      </div>
      <Button type="submit" className="w-full mt-6">
        Agendar Férias
      </Button>
    </form>
  );
};
