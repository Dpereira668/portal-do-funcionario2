
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  FileSpreadsheet,
  Users,
  CalendarRange,
  AlertTriangle,
  FileText,
  Shirt,
  Ban,
  LineChart
} from "lucide-react";

interface ReportOption {
  title: string;
  description: string;
  icon: React.ReactNode;
  handler: () => Promise<void>;
}

const RelatoriosIndex = () => {
  const [isLoading, setIsLoading] = useState(false);

  const exportToCSV = (data: any[], filename: string, headers: string[]) => {
    const csvContent = [
      headers.join(','),
      ...data.map(item => 
        headers.map(header => 
          item[header.toLowerCase().replace(/ /g, '_')] || ''
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const generateEmployeeReport = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          positions(title)
        `);
      if (error) throw error;

      exportToCSV(
        data.map(emp => ({
          ...emp,
          position_title: emp.positions?.title
        })),
        'funcionarios',
        ['Nome', 'CPF', 'Email', 'Cargo', 'Local', 'Status']
      );
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateVacationReport = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('vacation_schedules')
        .select('*');
      if (error) throw error;

      exportToCSV(
        data,
        'ferias',
        ['Nome', 'Data Início', 'Data Fim', 'Observações']
      );
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAbsenceReport = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('absences')
        .select('*');
      if (error) throw error;

      exportToCSV(
        data,
        'faltas',
        ['Data', 'Motivo', 'Justificativa', 'Status']
      );
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePunishmentReport = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('punishments')
        .select('*');
      if (error) throw error;

      exportToCSV(
        data,
        'punicoes',
        ['Tipo', 'Motivo', 'Data Início', 'Data Fim']
      );
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateDocumentReport = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*');
      if (error) throw error;

      exportToCSV(
        data,
        'documentos',
        ['Tipo', 'Data', 'Status']
      );
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateUniformReport = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('uniforms')
        .select('*');
      if (error) throw error;

      exportToCSV(
        data,
        'uniformes',
        ['Tipo', 'Tamanho', 'Quantidade', 'Quantidade Mínima']
      );
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const reportOptions: ReportOption[] = [
    {
      title: "Relatório de Funcionários",
      description: "Lista completa de funcionários com detalhes",
      icon: <Users className="h-6 w-6 text-blue-500" />,
      handler: generateEmployeeReport
    },
    {
      title: "Relatório de Férias",
      description: "Agendamentos de férias por período",
      icon: <CalendarRange className="h-6 w-6 text-green-500" />,
      handler: generateVacationReport
    },
    {
      title: "Relatório de Faltas",
      description: "Registro de ausências e justificativas",
      icon: <Ban className="h-6 w-6 text-red-500" />,
      handler: generateAbsenceReport
    },
    {
      title: "Relatório de Punições",
      description: "Advertências e suspensões aplicadas",
      icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
      handler: generatePunishmentReport
    },
    {
      title: "Relatório de Documentos",
      description: "Documentos emitidos e pendentes",
      icon: <FileText className="h-6 w-6 text-purple-500" />,
      handler: generateDocumentReport
    },
    {
      title: "Relatório de Uniformes",
      description: "Controle de estoque e movimentações",
      icon: <Shirt className="h-6 w-6 text-indigo-500" />,
      handler: generateUniformReport
    }
  ];

  return (
    <ScrollArea className="h-screen">
      <div className="p-8 space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-primary">Relatórios</h2>
          <p className="text-muted-foreground">
            Geração de relatórios e análises
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportOptions.map((option, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  {option.icon}
                  <CardTitle>{option.title}</CardTitle>
                </div>
                <CardDescription>{option.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  onClick={() => option.handler()}
                  disabled={isLoading}
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Exportar CSV
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default RelatoriosIndex;
