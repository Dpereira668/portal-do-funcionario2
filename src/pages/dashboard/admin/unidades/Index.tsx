
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Plus } from "lucide-react";
import { AddWorkplaceForm } from "./components/AddWorkplaceForm";
import { WorkplaceCard } from "./components/WorkplaceCard";
import { Workplace } from "./types";

const UnidadesIndex = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: workplaces, isLoading } = useQuery({
    queryKey: ['workplaces'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workplaces')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data as Workplace[];
    }
  });

  return (
    <ScrollArea className="h-screen">
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-primary">Unidades</h2>
            <p className="text-muted-foreground">
              Gestão de locais de trabalho
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Unidade
              </Button>
            </DialogTrigger>
            <AddWorkplaceForm onSuccess={() => setIsAddDialogOpen(false)} />
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <p>Carregando...</p>
          ) : workplaces?.map((workplace) => (
            <WorkplaceCard key={workplace.id} workplace={workplace} />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default UnidadesIndex;
