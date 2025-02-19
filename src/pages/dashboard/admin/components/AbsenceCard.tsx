
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud } from "lucide-react";
import { type Absence } from "../types/absences";

interface AbsenceCardProps {
  absence: Absence;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>, absenceId: string) => void;
}

export const AbsenceCard = ({ absence, onFileUpload }: AbsenceCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{absence.employee_name}</h3>
            <p className="text-sm text-muted-foreground">
              {new Date(absence.absence_date).toLocaleDateString()}
            </p>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              absence.status === "justified"
                ? "bg-green-100 text-green-800"
                : absence.status === "unjustified"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {absence.status === "justified"
              ? "Justificada"
              : absence.status === "unjustified"
              ? "Não Justificada"
              : "Pendente"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">
            <strong>CPF:</strong> {absence.employee_cpf}
          </p>
          <p className="text-sm">
            <strong>Função:</strong> {absence.position_title}
          </p>
          <p className="text-sm">
            <strong>Posto:</strong> {absence.workplace}
          </p>
          <div className="border-t pt-2 mt-2">
            <p className="text-sm font-medium">
              Cobertura ({absence.coverage_type}):
            </p>
            <p className="text-sm">
              {absence.coverage_name} (CPF: {absence.coverage_cpf})
            </p>
            {absence.coverage_type === "prestador" && (
              <p className="text-sm">
                <strong>Valor:</strong> R$ {absence.coverage_value?.toFixed(2)}
              </p>
            )}
          </div>
          {absence.status === "pending" && (
            <div className="mt-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  document.getElementById(`file-${absence.id}`)?.click()
                }
              >
                <UploadCloud className="mr-2 h-4 w-4" />
                Enviar Justificativa
              </Button>
              <input
                id={`file-${absence.id}`}
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => onFileUpload(e, absence.id)}
              />
            </div>
          )}
          {absence.justification_file_url && (
            <div className="mt-2">
              <a
                href={absence.justification_file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Ver justificativa
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
