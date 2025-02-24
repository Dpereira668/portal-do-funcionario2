
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RegistrationRequest {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  position_title: string;
}

interface RegistrationRequestCardProps {
  request: RegistrationRequest;
  onApprove: (request: RegistrationRequest) => void;
  onReject: (requestId: string) => void;
}

export const RegistrationRequestCard = ({ 
  request, 
  onApprove, 
  onReject 
}: RegistrationRequestCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{request.name}</CardTitle>
        <CardDescription>CPF: {request.cpf}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">
            <strong>Email:</strong> {request.email}
          </p>
          <p className="text-sm">
            <strong>Telefone:</strong> {request.phone}
          </p>
          <p className="text-sm">
            <strong>Cargo Desejado:</strong> {request.position_title}
          </p>
          <div className="flex gap-2 mt-4">
            <Button
              size="sm"
              onClick={() => onApprove(request)}
            >
              Aprovar
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onReject(request.id)}
            >
              Rejeitar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
