
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { Bell, Calendar, Edit, FileText, UserCircle } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AdminProfile {
  id: string;
  name: string;
  email: string;
  function: string;
  phone: string;
  notes: string;
}

interface VacationSchedule {
  id: string;
  employee_name: string;
  employee_cpf: string;
  position_title: string;
  workplace: string;
  start_date: string;
  end_date: string;
  observation: string;
}

const DashboardAdmin = () => {
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [notes, setNotes] = useState("");

  const { data: pendingRequests } = useQuery({
    queryKey: ["pending-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("requests")
        .select(`
          *,
          profiles(name, cpf, positions(title), workplace)
        `)
        .eq("status", "pendente");
      if (error) throw error;
      return data;
    },
  });

  const { data: vacationSchedules } = useQuery({
    queryKey: ["vacation-schedules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vacation_schedules")
        .select(`
          *,
          profiles(name, cpf, positions(title), workplace)
        `);
      if (error) throw error;
      return data;
    },
  });

  const updateAdminProfile = async (profile: Partial<AdminProfile>) => {
    const { data, error } = await supabase
      .from("admin_profiles")
      .update(profile)
      .eq("id", adminProfile?.id)
      .select()
      .single();

    if (error) throw error;
    setAdminProfile(data);
    setEditingProfile(false);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card de Solicitações Pendentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Solicitações Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingRequests?.map((request) => (
                <Link
                  key={request.id}
                  to={`/admin/solicitacoes/${request.id}`}
                  className="block p-4 border rounded-lg hover:bg-accent"
                >
                  <p className="font-medium">{request.profiles?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {request.type === "ferias"
                      ? "Solicitação de Férias"
                      : request.type === "uniforme"
                      ? "Solicitação de Uniforme"
                      : "Outras Solicitações"}
                  </p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Card de Férias Agendadas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Férias Agendadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vacationSchedules?.map((schedule) => (
                <div key={schedule.id} className="p-4 border rounded-lg">
                  <p className="font-medium">{schedule.profiles?.name}</p>
                  <p className="text-sm">
                    {new Date(schedule.start_date).toLocaleDateString()} até{" "}
                    {new Date(schedule.end_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {schedule.observation}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Card de Perfil do Administrador */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <UserCircle className="mr-2 h-5 w-5" />
                Meu Perfil
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingProfile(!editingProfile)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {editingProfile ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nome</label>
                  <Input
                    value={adminProfile?.name || ""}
                    onChange={(e) =>
                      setAdminProfile((prev) => ({
                        ...prev!,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    value={adminProfile?.email || ""}
                    onChange={(e) =>
                      setAdminProfile((prev) => ({
                        ...prev!,
                        email: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Função</label>
                  <Input
                    value={adminProfile?.function || ""}
                    onChange={(e) =>
                      setAdminProfile((prev) => ({
                        ...prev!,
                        function: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Telefone</label>
                  <Input
                    value={adminProfile?.phone || ""}
                    onChange={(e) =>
                      setAdminProfile((prev) => ({
                        ...prev!,
                        phone: e.target.value,
                      }))
                    }
                  />
                </div>
                <Button
                  onClick={() => updateAdminProfile(adminProfile!)}
                  className="w-full"
                >
                  Salvar
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <p>
                  <strong>Nome:</strong> {adminProfile?.name}
                </p>
                <p>
                  <strong>Email:</strong> {adminProfile?.email}
                </p>
                <p>
                  <strong>Função:</strong> {adminProfile?.function}
                </p>
                <p>
                  <strong>Telefone:</strong> {adminProfile?.phone}
                </p>
              </div>
            )}
            <div className="mt-4">
              <label className="text-sm font-medium">Bloco de Notas</label>
              <textarea
                className="w-full mt-2 p-2 border rounded-md min-h-[100px]"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Digite suas anotações aqui..."
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardAdmin;
