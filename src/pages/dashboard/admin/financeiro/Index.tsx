
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Plus, DollarSign, FileDown, Check, X } from "lucide-react";

interface FinancialCharge {
  id: string;
  workplace_id: string;
  amount: number;
  due_date: string;
  status: string;
  notes: string | null;
  created_at: string;
}

interface Workplace {
  id: string;
  name: string;
}

const FinanceiroIndex = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: charges, isLoading } = useQuery({
    queryKey: ['financial_charges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_charges')
        .select(`
          *,
          workplace:workplaces(name)
        `)
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data as (FinancialCharge & { workplace: Workplace })[];
    }
  });

  const { data: workplaces } = useQuery({
    queryKey: ['workplaces'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workplaces')
        .select('id, name')
        .order('name');

      if (error) throw error;
      return data as Workplace[];
    }
  });

  const handleAddCharge = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    try {
      const { error } = await supabase
        .from('financial_charges')
        .insert({
          workplace_id: formData.get('workplace_id'),
          amount: parseFloat(formData.get('amount') as string),
          due_date: formData.get('due_date'),
          notes: formData.get('notes'),
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast({
        title: "Cobrança adicionada",
        description: "A cobrança foi adicionada com sucesso.",
      });

      setIsAddDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['financial_charges'] });
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar cobrança",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = async (chargeId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('financial_charges')
        .update({ status: newStatus })
        .eq('id', chargeId);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: "O status da cobrança foi atualizado com sucesso.",
      });

      queryClient.invalidateQueries({ queryKey: ['financial_charges'] });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const exportToCSV = () => {
    if (!charges) return;

    const headers = ['Local', 'Valor', 'Vencimento', 'Status', 'Observações'];
    const csvContent = [
      headers.join(','),
      ...charges.map(charge => [
        charge.workplace.name,
        charge.amount.toFixed(2),
        new Date(charge.due_date).toLocaleDateString(),
        charge.status,
        charge.notes || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `cobrancas_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pago':
        return 'text-green-500 bg-green-100';
      case 'cancelado':
        return 'text-red-500 bg-red-100';
      default:
        return 'text-yellow-500 bg-yellow-100';
    }
  };

  return (
    <ScrollArea className="h-screen">
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-primary">Gestão Financeira</h2>
            <p className="text-muted-foreground">
              Controle de cobranças e pagamentos
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
                  Nova Cobrança
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nova Cobrança</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddCharge} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Local</label>
                    <select
                      name="workplace_id"
                      className="w-full p-2 border rounded-md"
                      required
                    >
                      <option value="">Selecione o local</option>
                      {workplaces?.map((workplace) => (
                        <option key={workplace.id} value={workplace.id}>
                          {workplace.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Valor</label>
                    <Input 
                      name="amount" 
                      type="number" 
                      step="0.01" 
                      min="0" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Data de Vencimento</label>
                    <Input 
                      name="due_date" 
                      type="date" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Observações</label>
                    <Input name="notes" />
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
          ) : charges?.map((charge) => (
            <Card key={charge.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    {charge.workplace.name}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(charge.status)}`}>
                    {charge.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Valor:</span>
                    <span className="font-bold">{formatCurrency(charge.amount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Vencimento:</span>
                    <span>{new Date(charge.due_date).toLocaleDateString()}</span>
                  </div>
                  {charge.notes && (
                    <p className="text-sm text-muted-foreground">{charge.notes}</p>
                  )}
                  {charge.status === 'pendente' && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleUpdateStatus(charge.id, 'pago')}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Confirmar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleUpdateStatus(charge.id, 'cancelado')}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancelar
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default FinanceiroIndex;
