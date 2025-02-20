
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Plus, FileDown } from "lucide-react";
import { AddUniformForm } from "./components/AddUniformForm";
import { UniformCard } from "./components/UniformCard";
import { Uniform } from "./types";

const UniformesIndex = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: uniforms, isLoading } = useQuery({
    queryKey: ['uniforms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('uniforms')
        .select('*')
        .order('type', { ascending: true });

      if (error) throw error;
      return data as Uniform[];
    }
  });

  const exportToCSV = () => {
    if (!uniforms) return;

    const headers = ['Tipo', 'Tamanho', 'Quantidade', 'Quantidade Mínima'];
    const csvContent = [
      headers.join(','),
      ...uniforms.map(uniform => [
        uniform.type,
        uniform.size,
        uniform.quantity,
        uniform.min_quantity
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `uniformes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <ScrollArea className="h-screen">
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-primary">Gestão de Uniformes</h2>
            <p className="text-muted-foreground">
              Controle o estoque de uniformes da empresa
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={exportToCSV}>
              <FileDown className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Uniforme
                </Button>
              </DialogTrigger>
              <AddUniformForm onSuccess={() => setIsAddDialogOpen(false)} />
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <p>Carregando...</p>
          ) : uniforms?.map((uniform) => (
            <UniformCard key={uniform.id} uniform={uniform} />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default UniformesIndex;
