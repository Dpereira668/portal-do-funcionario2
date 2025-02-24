
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Upload } from "lucide-react";
import { useState } from "react";
import { EmployeeCard } from "./components/EmployeeCard";
import { RegistrationRequestCard } from "./components/RegistrationRequestCard";
import { AddEmployeeDialog } from "./components/AddEmployeeDialog";

const GestaoFuncionarios = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const { data: registrationRequests, refetch: refetchRequests } = useQuery({
    queryKey: ["registration_requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("registration_requests")
        .select("*")
        .eq("status", "pending");
      
      if (error) throw error;
      return data;
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
          role: 'funcionario',
          status: 'active'
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

        if (positionError) throw positionError;

        positionId = newPosition.id;
        await refetchPositions();
      }

      // Cria o perfil do funcionário
      const { error: profileError } = await supabase.from("profiles").insert({
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        cpf: formData.get("cpf") as string,
        phone: formData.get("phone") as string,
        position_id: positionId,
        workplace: formData.get("workplace") as string,
        address: formData.get("address") as string,
        birth_date: formData.get("birth_date") as string,
        admission_date: formData.get("admission_date") as string,
        role: 'funcionario',
        status: 'active'
      });

      if (profileError) throw profileError;

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

  const handleApproveRequest = async (request: any) => {
    try {
      // Procura ou cria o cargo
      let positionId = positions?.find(
        p => p.title.toLowerCase() === request.position_title.toLowerCase()
      )?.id;

      if (!positionId) {
        const { data: newPosition, error: positionError } = await supabase
          .from("positions")
          .insert({ title: request.position_title })
          .select("id")
          .single();

        if (positionError) throw positionError;
        positionId = newPosition.id;
      }

      // Cria o perfil do funcionário
      const { error: profileError } = await supabase.from("profiles").insert({
        name: request.name,
        email: request.email,
        cpf: request.cpf,
        phone: request.phone,
        position_id: positionId,
        role: 'funcionario',
        status: 'active'
      });

      if (profileError) throw profileError;

      // Atualiza o status da solicitação para aprovado
      const { error: requestError } = await supabase
        .from("registration_requests")
        .update({ status: 'approved' })
        .eq('id', request.id);

      if (requestError) throw requestError;

      toast({
        title: "Solicitação aprovada",
        description: "O funcionário foi cadastrado com sucesso!",
      });

      refetchRequests();
      refetchEmployees();
    } catch (error: any) {
      toast({
        title: "Erro ao aprovar solicitação",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from("registration_requests")
        .update({ status: 'rejected' })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Solicitação rejeitada",
        description: "A solicitação foi rejeitada com sucesso.",
      });

      refetchRequests();
    } catch (error: any) {
      toast({
        title: "Erro ao rejeitar solicitação",
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
              <AddEmployeeDialog onSubmit={handleAddEmployee} />
            </Dialog>
          </div>
        </div>

        {registrationRequests && registrationRequests.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Solicitações de Cadastro Pendentes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {registrationRequests.map((request) => (
                <RegistrationRequestCard
                  key={request.id}
                  request={request}
                  onApprove={handleApproveRequest}
                  onReject={handleRejectRequest}
                />
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees?.map((employee) => (
            <EmployeeCard key={employee.id} employee={employee} />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default GestaoFuncionarios;
