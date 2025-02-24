
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AVAILABLE_POSITIONS } from "@/constants/positions";

interface AddEmployeeDialogProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const AddEmployeeDialog = ({ onSubmit }: AddEmployeeDialogProps) => {
  return (
    <DialogContent>
      <ScrollArea className="max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Adicionar Funcionário</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo funcionário
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 p-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome</label>
            <Input name="name" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input name="email" type="email" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">CPF</label>
            <Input name="cpf" required pattern="\d{11}" maxLength={11} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Telefone</label>
            <Input name="phone" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Endereço</label>
            <Input name="address" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Data de Nascimento</label>
            <Input name="birth_date" type="date" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Data de Admissão</label>
            <Input name="admission_date" type="date" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Cargo</label>
            <select name="position" className="w-full p-2 border rounded-md" required>
              <option value="">Selecione um cargo</option>
              {AVAILABLE_POSITIONS.map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Local de Trabalho</label>
            <Input name="workplace" required />
          </div>
          <Button type="submit" className="w-full">
            Adicionar
          </Button>
        </form>
      </ScrollArea>
    </DialogContent>
  );
};
