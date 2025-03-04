
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, Save, X } from "lucide-react";
import { useState } from "react";
import { Uniform } from "../types";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface UniformCardProps {
  uniform: Uniform;
}

export const UniformCard = ({ uniform }: UniformCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUniform, setEditedUniform] = useState(uniform);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const getBgColor = () => {
    if (uniform.quantity <= 0) {
      return "bg-red-100";
    }
    if (uniform.quantity <= uniform.min_quantity) {
      return "bg-amber-100";
    }
    return "bg-white";
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUniform(uniform);
  };

  const handleChange = (field: string, value: string | number) => {
    setEditedUniform((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('uniforms')
        .update({
          type: editedUniform.type,
          size: editedUniform.size,
          quantity: editedUniform.quantity,
          min_quantity: editedUniform.min_quantity,
        })
        .eq('id', uniform.id);

      if (error) throw error;

      toast({
        title: "Uniforme atualizado",
        description: "As informações do uniforme foram atualizadas com sucesso.",
      });

      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['uniforms'] });
    } catch (error: any) {
      console.error('Erro ao atualizar uniforme:', error);
      toast({
        title: "Erro ao atualizar uniforme",
        description: error.message || "Ocorreu um erro ao atualizar o uniforme. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir este uniforme?")) {
      try {
        const { error } = await supabase
          .from('uniforms')
          .delete()
          .eq('id', uniform.id);

        if (error) throw error;

        toast({
          title: "Uniforme removido",
          description: "O uniforme foi removido com sucesso.",
        });

        queryClient.invalidateQueries({ queryKey: ['uniforms'] });
      } catch (error: any) {
        console.error('Erro ao excluir uniforme:', error);
        toast({
          title: "Erro ao excluir uniforme",
          description: error.message || "Ocorreu um erro ao excluir o uniforme. Tente novamente.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card className={`shadow-sm ${getBgColor()}`}>
      <CardContent className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Tipo</label>
              <Input
                value={editedUniform.type}
                onChange={(e) => handleChange("type", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tamanho</label>
              <select
                value={editedUniform.size}
                onChange={(e) => handleChange("size", e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="PP">PP</option>
                <option value="P">P</option>
                <option value="M">M</option>
                <option value="G">G</option>
                <option value="GG">GG</option>
                <option value="XG">XG</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Quantidade</label>
              <Input
                type="number"
                min="0"
                value={editedUniform.quantity}
                onChange={(e) =>
                  handleChange("quantity", Number(e.target.value))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">Quantidade Mínima</label>
              <Input
                type="number"
                min="0"
                value={editedUniform.min_quantity}
                onChange={(e) =>
                  handleChange("min_quantity", Number(e.target.value))
                }
              />
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{uniform.type}</h3>
                <p className="text-sm text-muted-foreground">
                  Tamanho: {uniform.size}
                </p>
              </div>
              <div className="text-right">
                <span className="font-semibold">{uniform.quantity}</span>
                <p className="text-xs text-muted-foreground">
                  Mínimo: {uniform.min_quantity}
                </p>
              </div>
            </div>
            {uniform.quantity <= 0 && (
              <div className="mt-2 text-red-600 text-sm font-semibold">
                Sem estoque!
              </div>
            )}
            {uniform.quantity > 0 && uniform.quantity <= uniform.min_quantity && (
              <div className="mt-2 text-amber-600 text-sm font-semibold">
                Estoque baixo!
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-end gap-2">
        {isEditing ? (
          <>
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4 mr-1" /> Cancelar
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" /> Salvar
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-1" /> Editar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Excluir
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};
