
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

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
    <Card>
      <CardHeader>
        <CardTitle>{employee.name}</CardTitle>
        <CardDescription>CPF: {employee.cpf}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">
            <strong>Email:</strong> {employee.email}
          </p>
          <p className="text-sm">
            <strong>Telefone:</strong> {employee.phone}
          </p>
          <p className="text-sm">
            <strong>Cargo:</strong> {employee.position_title}
          </p>
          <p className="text-sm">
            <strong>Local:</strong> {employee.workplace}
          </p>
          <div className="flex justify-end mt-4">
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Ver Detalhes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
