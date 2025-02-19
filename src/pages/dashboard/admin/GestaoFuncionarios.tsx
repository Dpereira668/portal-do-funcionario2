
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { FileText, Plus, Upload } from "lucide-react";
import { useState } from "react";
import { AVAILABLE_POSITIONS } from "@/constants/positions";

interface Employee {
  id: string;
  cpf: string;
  name: string;
  position_id: string;
  workplace: string;
  position_title?: string;
}

const GestaoFuncionarios = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: positions, refetch: refetchPositions } = useQuery({
    queryKey: ["positions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("positions").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: employees, refetch: refetchEmployees } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          positions(title)
        `)
        .not("position_id", "is", null);
      
      if (error) throw error;
      return data.map(emp => ({
        ...emp,
        position_title: emp.positions?.title,
      }));
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const rows = text.split("\n").slice(1); // Pula o cabeçalho
      
      for (const row of rows) {
        const [name, cpf, position, workplace] = row.split(",").map(item => item.trim());
        
        // Encontra ou cria o cargo
        let positionId = positions?.find(p => p.title.toLowerCase() === position.toLowerCase())?.id;
        if (!positionId) {
          const { data } = await supabase
            .from("positions")
            .insert({ title: position })
            .select("id")
            .single();
          positionId = data?.id;
        }

        // Cria o perfil do funcionário
        const { error } = await supabase.from("profiles").insert({
          name,
          cpf,
          position_id: positionId,
          workplace,
          role: 'funcionario'
        });

        if (error) {
          console.error('Erro ao criar perfil:', error);
          throw error;
        }
      }

      toast({
        title: "Funcionários importados",
        description: "Os funcionários foram importados com sucesso!",
      });

      refetchEmployees();
    } catch (error: any) {
      toast({
        title: "Erro na importação",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddEmployee = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    try {
      const positionTitle = formData.get("position") as string;
      
      // Procura cargo existente primeiro
      let positionId = positions?.find(
        p => p.title.toLowerCase() === positionTitle.toLowerCase()
      )?.id;

      // Se não encontrar, cria novo cargo
      if (!positionId) {
        const { data: newPosition, error: positionError } = await supabase
          .from("positions")
          .insert({ title: positionTitle })
          .select("id")
          .single();

        if (positionError) {
          console.error('Erro ao criar cargo:', positionError);
          throw positionError;
        }

        positionId = newPosition.id;
        await refetchPositions();
      }

      // Cria o perfil do funcionário
      const { error: profileError } = await supabase.from("profiles").insert({
        name: formData.get("name") as string,
        cpf: formData.get("cpf") as string,
        position_id: positionId,
        workplace: formData.get("workplace") as string,
        role: 'funcionario'
      });

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError);
        throw profileError;
      }

      toast({
        title: "Funcionário adicionado",
        description: "O funcionário foi adicionado com sucesso!",
      });

      setIsAddDialogOpen(false);
      refetchEmployees();
    } catch (error: any) {
      console.error('Erro completo:', error);
      toast({
        title: "Erro ao adicionar funcionário",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <ScrollArea className="h-screen">
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-primary">Gestão de Funcionários</h2>
            <p className="text-muted-foreground">
              Gerencie os funcionários da empresa
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              Importar CSV
              <input
                id="file-upload"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileUpload}
              />
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Funcionário
                </Button>
              </DialogTrigger>
              <DialogContent>
                <ScrollArea className="max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>Adicionar Funcionário</DialogTitle>
                    <DialogDescription>
                      Preencha os dados do novo funcionário
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddEmployee} className="space-y-4 p-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nome</label>
                      <Input name="name" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">CPF</label>
                      <Input name="cpf" required pattern="\d{11}" maxLength={11} />
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
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees?.map((employee) => (
            <Card key={employee.id}>
              <CardHeader>
                <CardTitle>{employee.name}</CardTitle>
                <CardDescription>CPF: {employee.cpf}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Cargo:</strong> {employee.position_title}
                  </p>
                  <p className="text-sm">
                    <strong>Local:</strong> {employee.workplace}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default GestaoFuncionarios;
