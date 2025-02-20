
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileDown, Plus } from "lucide-react";
import { AbsenceForm } from "./AbsenceForm";

interface AbsenceHeaderProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  coverageType: "standby" | "prestador";
  onCoverageTypeChange: (type: "standby" | "prestador") => void;
  onAddAbsence: (event: React.FormEvent<HTMLFormElement>) => void;
  onDownloadMonthlyReport: () => void;
  onDownloadProviderReport: () => void;
}

export const AbsenceHeader = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  coverageType,
  onCoverageTypeChange,
  onAddAbsence,
  onDownloadMonthlyReport,
  onDownloadProviderReport,
}: AbsenceHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold text-primary">
          Lançamento de Faltas
        </h2>
        <p className="text-muted-foreground">
          Gerencie as faltas e coberturas dos funcionários
        </p>
      </div>
      <div className="flex gap-4">
        <Button variant="outline" onClick={onDownloadMonthlyReport}>
          <FileDown className="mr-2 h-4 w-4" />
          Relatório de Faltas
        </Button>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Lançar Falta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl h-[90vh]">
            <DialogHeader>
              <DialogTitle>Lançar Falta</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-full pr-4">
              <AbsenceForm
                coverageType={coverageType}
                onCoverageTypeChange={onCoverageTypeChange}
                onSubmit={onAddAbsence}
              />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
