
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Mail, Phone, MapPin, User } from "lucide-react";

interface Employee {
  id: string;
  cpf: string;
  name: string;
  email: string;
  phone: string;
  position_title?: string;
  workplace: string;
}

interface EmployeeCardProps {
  employee: Employee;
}

export const EmployeeCard = ({ employee }: EmployeeCardProps) => {
  return (
    <Card className="transition-all hover:shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-lg">{employee.name}</CardTitle>
        </div>
        <CardDescription className="flex items-center gap-2">
          <span className="font-medium">CPF:</span> {employee.cpf}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm truncate">{employee.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{employee.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{employee.position_title || "Não definido"}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{employee.workplace}</span>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <FileText className="h-4 w-4 mr-2" />
              Ver Detalhes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
