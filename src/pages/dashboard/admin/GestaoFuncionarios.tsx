
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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { FileText, Plus, Upload } from "lucide-react";
import { useState } from "react";

interface Employee {
  cpf: string;
  name: string;
  position_id: string;
  workplace_id: string;
  position_title?: string;
  workplace_name?: string;
}

const GestaoFuncionarios = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: positions } = useQuery({
    queryKey: ["positions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("positions").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: workplaces } = useQuery({
    queryKey: ["workplaces"],
    queryFn: async () => {
      const { data, error } = await supabase.from("workplaces").select("*");
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
          positions(title),
          workplaces(name)
        `)
        .not("position_id", "is", null);
      
      if (error) throw error;
      return data.map(emp => ({
        ...emp,
        position_title: emp.positions?.title,
        workplace_name: emp.workplaces?.name
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

        // Encontra ou cria o local de trabalho
        let workplaceId = workplaces?.find(w => w.name.toLowerCase() === workplace.toLowerCase())?.id;
        if (!workplaceId) {
          const { data } = await supabase
            .from("workplaces")
            .insert({ name: workplace })
            .select("id")
            .single();
          workplaceId = data?.id;
        }

        // Cria o perfil do funcionário
        await supabase.from("profiles").insert({
          name,
          cpf,
          position_id: positionId,
          workplace_id: workplaceId,
          role: 'funcionario'
        });
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

  const handleAddEmployee = async (employee: Employee) => {
    try {
      const { error } = await supabase.from("profiles").insert({
        ...employee,
        role: 'funcionario'
      });

      if (error) throw error;

      toast({
        title: "Funcionário adicionado",
        description: "O funcionário foi adicionado com sucesso!",
      });

      setIsAddDialogOpen(false);
      refetchEmployees();
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar funcionário",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
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
            Importar XML
            <input
              id="file-upload"
              type="file"
              accept=".csv,.xml"
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
              <DialogHeader>
                <DialogTitle>Adicionar Funcionário</DialogTitle>
                <DialogDescription>
                  Preencha os dados do novo funcionário
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleAddEmployee({
                  name: formData.get("name") as string,
                  cpf: formData.get("cpf") as string,
                  position_id: formData.get("position_id") as string,
                  workplace_id: formData.get("workplace_id") as string,
                });
              }} className="space-y-4">
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
                  <select name="position_id" className="w-full p-2 border rounded-md" required>
                    <option value="">Selecione um cargo</option>
                    {positions?.map((position) => (
                      <option key={position.id} value={position.id}>
                        {position.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Local de Trabalho</label>
                  <select name="workplace_id" className="w-full p-2 border rounded-md" required>
                    <option value="">Selecione um local</option>
                    {workplaces?.map((workplace) => (
                      <option key={workplace.id} value={workplace.id}>
                        {workplace.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Button type="submit" className="w-full">
                  Adicionar
                </Button>
              </form>
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
                  <strong>Local:</strong> {employee.workplace_name}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GestaoFuncionarios;
