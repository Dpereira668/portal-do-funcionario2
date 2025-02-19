
import { AbsenceCard } from "./AbsenceCard";
import { type Absence } from "../types/absences";

interface AbsenceListProps {
  absences?: Absence[];
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>, absenceId: string) => void;
}

export const AbsenceList = ({ absences, onFileUpload }: AbsenceListProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {absences?.map((absence) => (
        <AbsenceCard
          key={absence.id}
          absence={absence}
          onFileUpload={onFileUpload}
        />
      ))}
    </div>
  );
};
