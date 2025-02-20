
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Plus, Package2, PackagePlus, FileDown } from "lucide-react";

interface Uniform {
  id: string;
  type: string;
  size: string;
  quantity: number;
  min_quantity: number;
  created_at: string;
  updated_at: string;
}

const UniformesIndex = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
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

  const handleAddUniform = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    try {
      const { error } = await supabase
        .from('uniforms')
        .insert({
          type: formData.get('type'),
          size: formData.get('size'),
          quantity: parseInt(formData.get('quantity') as string, 10),
          min_quantity: parseInt(formData.get('min_quantity') as string, 10),
        });

      if (error) throw error;

      toast({
        title: "Uniforme adicionado",
        description: "O uniforme foi adicionado com sucesso.",
      });

      setIsAddDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['uniforms'] });
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar uniforme",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleMove = async (uniformId: string, quantity: number, type: 'entrada' | 'saida') => {
    try {
      const { error: movementError } = await supabase
        .from('uniform_movements')
        .insert({
          uniform_id: uniformId,
          quantity: Math.abs(quantity),
          movement_type: type,
        });

      if (movementError) throw movementError;

      const { error: updateError } = await supabase
        .from('uniforms')
        .update({ 
          quantity: type === 'entrada' 
            ? quantity 
            : quantity * -1 
        })
        .eq('id', uniformId);

      if (updateError) throw updateError;

      toast({
        title: "Movimentação registrada",
        description: `${type === 'entrada' ? 'Entrada' : 'Saída'} registrada com sucesso.`,
      });

      queryClient.invalidateQueries({ queryKey: ['uniforms'] });
    } catch (error: any) {
      toast({
        title: "Erro ao registrar movimentação",
        description: error.message,
        variant: "destructive",
      });
    }
  };

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
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Uniforme</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddUniform} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo</label>
                    <Input name="type" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tamanho</label>
                    <select
                      name="size"
                      className="w-full p-2 border rounded-md"
                      required
                    >
                      <option value="">Selecione o tamanho</option>
                      <option value="PP">PP</option>
                      <option value="P">P</option>
                      <option value="M">M</option>
                      <option value="G">G</option>
                      <option value="GG">GG</option>
                      <option value="XG">XG</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quantidade</label>
                    <Input 
                      name="quantity" 
                      type="number" 
                      min="0" 
                      defaultValue="0" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quantidade Mínima</label>
                    <Input 
                      name="min_quantity" 
                      type="number" 
                      min="0" 
                      defaultValue="0" 
                      required 
                    />
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
          {isLoading ? (
            <p>Carregando...</p>
          ) : uniforms?.map((uniform) => (
            <Card key={uniform.id}>
              <CardHeader>
                <CardTitle>{uniform.type} - {uniform.size}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Em estoque:</span>
                    <span className={`font-bold ${
                      uniform.quantity <= uniform.min_quantity 
                        ? 'text-red-500' 
                        : 'text-green-500'
                    }`}>
                      {uniform.quantity}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Quantidade mínima:</span>
                    <span>{uniform.min_quantity}</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleMove(uniform.id, 1, 'entrada')}
                    >
                      <PackagePlus className="mr-2 h-4 w-4" />
                      Entrada
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleMove(uniform.id, 1, 'saida')}
                      disabled={uniform.quantity <= 0}
                    >
                      <Package2 className="mr-2 h-4 w-4" />
                      Saída
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default UniformesIndex;
