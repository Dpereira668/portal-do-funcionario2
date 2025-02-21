
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Plus } from "lucide-react";
import { AddPositionForm } from "./components/AddPositionForm";
import { PositionCard } from "./components/PositionCard";
import { Position } from "./types";

const CargosIndex = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: positions, isLoading } = useQuery({
    queryKey: ['positions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('positions')
        .select('*')
        .order('title', { ascending: true });

      if (error) throw error;
      return data as Position[];
    }
  });

  return (
    <ScrollArea className="h-screen">
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-primary">Cargos e Funções</h2>
            <p className="text-muted-foreground">
              Gestão de cargos e atribuições
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Cargo
              </Button>
            </DialogTrigger>
            <AddPositionForm onSuccess={() => setIsAddDialogOpen(false)} />
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <p>Carregando...</p>
          ) : positions?.map((position) => (
            <PositionCard key={position.id} position={position} />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default CargosIndex;
