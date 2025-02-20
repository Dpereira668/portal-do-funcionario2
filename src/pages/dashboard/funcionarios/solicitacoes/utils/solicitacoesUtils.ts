
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
      const items = request.uniformeItens.map((item: any) => 
        `${item.tipoUniforme} - Tamanho ${item.tamanhoUniforme} - ${item.quantidade} unidade(s)`
      ).join('\n');
      return items;

    case 'ferias':
      return `Período: ${format(new Date(request.dataInicio), 'dd/MM/yyyy')} a ${format(new Date(request.dataFim), 'dd/MM/yyyy')}`;
    
    case 'documento':
      return `Data solicitada: ${format(new Date(request.dataInicio), 'dd/MM/yyyy')}`;
    
    case 'adiantamento':
      return `Valor: R$ ${request.advance_amount}\nMotivo: ${request.advance_reason}`;
    
    default:
      return request.observacoes || '';
  }
};

// Tipos de uniformes disponíveis
export const uniformTypes = [
  { value: "camisa-social", label: "Camisa Social" },
  { value: "camisa-polo", label: "Camisa Polo" },
  { value: "calca", label: "Calça" },
  { value: "blazer", label: "Blazer" }
];

// Tamanhos de uniformes disponíveis
export const uniformSizes = [
  { value: "PP", label: "PP" },
  { value: "P", label: "P" },
  { value: "M", label: "M" },
  { value: "G", label: "G" },
  { value: "GG", label: "GG" },
  { value: "XG", label: "XG" }
];

// Validação das datas de férias
export const validateVacationDates = (startDate: Date, endDate: Date) => {
  const minDays = 10; // Mínimo de 10 dias
  const maxDays = 30; // Máximo de 30 dias
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < minDays) {
    return `Período mínimo de férias é de ${minDays} dias`;
  }
  if (diffDays > maxDays) {
    return `Período máximo de férias é de ${maxDays} dias`;
  }
  return null;
};

// Validação do valor de adiantamento
export const validateAdvanceAmount = (amount: number) => {
  const minAmount = 100;
  const maxAmount = 5000;
  
  if (amount < minAmount) {
    return `Valor mínimo de adiantamento é R$ ${minAmount}`;
  }
  if (amount > maxAmount) {
    return `Valor máximo de adiantamento é R$ ${maxAmount}`;
  }
  return null;
};

// Tipos de documentos disponíveis
export const documentTypes = [
  { value: "declaracao", label: "Declaração de Vínculo" },
  { value: "carteira", label: "Carteira de Trabalho" },
  { value: "contracheque", label: "Contracheque" },
  { value: "ferias", label: "Recibo de Férias" },
  { value: "outros", label: "Outros Documentos" }
];
