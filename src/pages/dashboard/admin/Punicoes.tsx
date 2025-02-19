
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AlertTriangle, FileText, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

const Punicoes = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: punishments, refetch } = useQuery({
    queryKey: ["punishments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("punishments")
        .select(`
          *,
          profiles:employee_id (
            name,
            cpf
          )
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, punishmentId: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${punishmentId}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("punishment-documents")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("punishment-documents")
        .getPublicUrl(fileName);

      await supabase
        .from("punishments")
        .update({ document_url: publicUrl })
        .eq("id", punishmentId);

      toast({
        title: "Documento enviado",
        description: "O documento foi anexado com sucesso!",
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Erro ao enviar documento",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddPunishment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const { error } = await supabase
        .from("punishments")
        .insert({
          employee_id: formData.get("employee_id"),
          type: formData.get("type"),
          reason: formData.get("reason"),
          start_date: formData.get("start_date"),
          end_date: formData.get("end_date") || null,
        });

      if (error) throw error;

      toast({
        title: "Punição registrada",
        description: "A punição foi registrada com sucesso!",
      });

      setIsAddDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast({
        title: "Erro ao registrar punição",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-primary">Punições</h2>
          <p className="text-muted-foreground">
            Gerencie advertências e suspensões
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Punição
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Nova Punição</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[80vh]">
              <form onSubmit={handleAddPunishment} className="space-y-4 p-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Funcionário</label>
                  <select 
                    name="employee_id" 
                    className="w-full p-2 border rounded-md" 
                    required
                  >
                    <option value="">Selecione um funcionário</option>
                    {/* Adicionar lista de funcionários aqui */}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo</label>
                  <select 
                    name="type" 
                    className="w-full p-2 border rounded-md" 
                    required
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="advertencia">Advertência</option>
                    <option value="suspensao">Suspensão</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Motivo</label>
                  <textarea 
                    name="reason" 
                    className="w-full p-2 border rounded-md min-h-[100px]" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data de Início</label>
                  <Input name="start_date" type="date" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data de Fim (apenas para suspensão)</label>
                  <Input name="end_date" type="date" />
                </div>
                <Button type="submit" className="w-full">
                  Registrar Punição
                </Button>
              </form>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {punishments?.map((punishment) => (
          <Card key={punishment.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                {punishment.type === "advertencia" ? "Advertência" : "Suspensão"}
              </CardTitle>
              <span className="text-sm text-muted-foreground">
                {format(new Date(punishment.start_date), "dd/MM/yyyy")}
              </span>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Funcionário</p>
                <p className="text-sm text-muted-foreground">
                  {punishment.profiles?.name}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Motivo</p>
                <p className="text-sm text-muted-foreground">{punishment.reason}</p>
              </div>
              {punishment.type === "suspensao" && punishment.end_date && (
                <div>
                  <p className="text-sm font-medium">Período</p>
                  <p className="text-sm text-muted-foreground">
                    Até {format(new Date(punishment.end_date), "dd/MM/yyyy")}
                  </p>
                </div>
              )}
              <div className="pt-2">
                {punishment.document_url ? (
                  <a
                    href={punishment.document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Ver Documento
                  </a>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById(`file-${punishment.id}`)?.click()}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Anexar Documento
                    </Button>
                    <input
                      id={`file-${punishment.id}`}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, punishment.id)}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Punicoes;
