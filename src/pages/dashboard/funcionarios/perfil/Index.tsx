
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, Building2, MapPin, Phone, Mail, Calendar, BookOpen } from "lucide-react";
import { useState } from "react";

const PerfilFuncionario = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          positions:position_id (title),
          workplaces:workplace_id (name, address)
        `)
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const userInitials = profile?.name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() || '??';

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-primary">Meu Perfil</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setEditing(!editing)}
          className="flex items-center gap-2"
        >
          <Pencil className="h-4 w-4" />
          Editar Perfil
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <Card>
          <CardHeader className="text-center">
            <Avatar className="w-32 h-32 mx-auto">
              <AvatarImage src={profile?.avatar_url} alt={profile?.name} />
              <AvatarFallback className="text-4xl">{userInitials}</AvatarFallback>
            </Avatar>
            <CardTitle className="mt-4">{profile?.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{profile?.positions?.title}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span>{profile?.department}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{profile?.workplaces?.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{profile?.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{profile?.email}</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">CPF</label>
                  <p className="text-muted-foreground">{profile?.cpf}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Data de Nascimento</label>
                  <p className="text-muted-foreground">
                    {profile?.birth_date && format(new Date(profile.birth_date), 'dd/MM/yyyy')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Endereço</label>
                  <p className="text-muted-foreground">{profile?.address}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Local de Trabalho</label>
                  <p className="text-muted-foreground">{profile?.workplaces?.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Informações Profissionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <label className="text-sm font-medium">Data de Admissão</label>
                    <p className="text-muted-foreground">
                      {profile?.admission_date && format(new Date(profile.admission_date), 'dd/MM/yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <label className="text-sm font-medium">Cargo</label>
                    <p className="text-muted-foreground">{profile?.positions?.title}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PerfilFuncionario;
