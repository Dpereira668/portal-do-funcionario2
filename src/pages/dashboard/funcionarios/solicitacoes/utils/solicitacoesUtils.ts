
import { Calendar, FileText, PiggyBank, Shirt } from "lucide-react";
import { format } from "date-fns";

export const getIconForType = (type: string) => {
  switch (type) {
    case 'uniforme':
      return Shirt;
    case 'ferias':
      return Calendar;
    case 'documento':
      return FileText;
    case 'adiantamento':
      return PiggyBank;
    default:
      return FileText;
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "aprovado":
      return "text-green-600 bg-green-100";
    case "rejeitado":
      return "text-red-600 bg-red-100";
    default:
      return "text-yellow-600 bg-yellow-100";
  }
};

export const formatRequestDetails = (request: any) => {
  switch (request.type) {
    case 'uniforme':
      return `${request.uniform_type} - Tamanho ${request.uniform_size} - ${request.uniform_quantity} unidade(s)`;
    case 'ferias':
      return `Período: ${format(new Date(request.start_date), 'dd/MM/yyyy')} a ${format(new Date(request.end_date), 'dd/MM/yyyy')}`;
    case 'documento':
      return `Data: ${format(new Date(request.start_date), 'dd/MM/yyyy')}`;
    case 'adiantamento':
      return `Valor: R$ ${request.advance_amount}`;
    default:
      return request.notes;
  }
};
