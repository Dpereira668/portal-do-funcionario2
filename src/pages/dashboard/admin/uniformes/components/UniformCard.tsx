
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package2, PackagePlus } from "lucide-react";
import { Uniform } from "../types";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface UniformCardProps {
  uniform: Uniform;
}

export const UniformCard = ({ uniform }: UniformCardProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  return (
    <Card>
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
  );
};
