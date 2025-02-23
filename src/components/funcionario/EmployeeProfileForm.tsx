
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { AVAILABLE_POSITIONS } from "@/constants/positions";

interface Profile {
  name: string;
  cpf: string;
  position_title: string;
  workplace: string;
}

export const EmployeeProfileForm = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("name, cpf, position_title, workplace")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar perfil",
        description: "Por favor, tente novamente mais tarde.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    try {
      const formData = new FormData(e.currentTarget);
      const updates = {
        name: formData.get("name"),
        cpf: formData.get("cpf"),
        position_title: formData.get("position_title"),
        workplace: formData.get("workplace"),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });
      setEditing(false);
      await fetchProfile();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar perfil",
        description: "Por favor, tente novamente mais tarde.",
      });
    }
  };

  if (loading) {
    return (
      <Card className="mt-6 mx-auto max-w-md">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile || !profile.name) {
    return (
      <Card className="mt-6 mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Complete seu Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nome Completo</label>
              <Input name="name" required />
            </div>
            <div>
              <label className="text-sm font-medium">CPF</label>
              <Input name="cpf" required pattern="\d{11}" maxLength={11} />
            </div>
            <div>
              <label className="text-sm font-medium">Cargo</label>
              <select 
                name="position_title" 
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Selecione um cargo</option>
                {AVAILABLE_POSITIONS.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Local de Trabalho</label>
              <Input name="workplace" required />
            </div>
            <Button type="submit" className="w-full">
              Salvar Perfil
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6 mx-auto max-w-md">
      <CardHeader>
        <CardTitle className="text-center">Meu Perfil</CardTitle>
      </CardHeader>
      <CardContent>
        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nome Completo</label>
              <Input name="name" defaultValue={profile.name} required />
            </div>
            <div>
              <label className="text-sm font-medium">CPF</label>
              <Input
                name="cpf"
                defaultValue={profile.cpf}
                required
                pattern="\d{11}"
                maxLength={11}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Cargo</label>
              <select 
                name="position_title" 
                className="w-full p-2 border rounded-md"
                defaultValue={profile.position_title}
                required
              >
                <option value="">Selecione um cargo</option>
                {AVAILABLE_POSITIONS.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Local de Trabalho</label>
              <Input name="workplace" defaultValue={profile.workplace} required />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setEditing(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="w-full">
                Salvar
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Nome</p>
              <p className="text-sm text-muted-foreground">{profile.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium">CPF</p>
              <p className="text-sm text-muted-foreground">{profile.cpf}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Cargo</p>
              <p className="text-sm text-muted-foreground">
                {profile.position_title}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Local de Trabalho</p>
              <p className="text-sm text-muted-foreground">{profile.workplace}</p>
            </div>
            <Button
              onClick={() => setEditing(true)}
              variant="outline"
              className="w-full"
            >
              Editar Perfil
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
