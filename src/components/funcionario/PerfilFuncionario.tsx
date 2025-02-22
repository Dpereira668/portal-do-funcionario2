
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Building2, MapPin, UserRound } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Profile {
  name: string | null;
  cpf: string | null;
  position_title: string | null;
  workplace: string | null;
}

export const PerfilFuncionario = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const { toast } = useToast();

  const fetchProfile = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user.id) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("name, cpf, position_title, workplace")
      .eq("id", session.session.user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return;
    }

    setProfile(data);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updates = {
      name: formData.get("name"),
      cpf: formData.get("cpf"),
      position_title: formData.get("position_title"),
      workplace: formData.get("workplace"),
    };

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", (await supabase.auth.getSession()).data.session?.user.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar perfil",
        description: "Por favor, tente novamente.",
      });
      return;
    }

    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram atualizadas com sucesso.",
    });
    setEditing(false);
    fetchProfile();
  };

  if (!profile) {
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
              <label className="text-sm font-medium">Função</label>
              <Input name="position_title" required />
            </div>
            <div>
              <label className="text-sm font-medium">Posto de Trabalho</label>
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
        <CardTitle className="text-center flex items-center justify-center gap-2">
          <UserRound className="w-6 h-6" />
          Meu Perfil
        </CardTitle>
      </CardHeader>
      <CardContent>
        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nome Completo</label>
              <Input name="name" defaultValue={profile.name || ""} required />
            </div>
            <div>
              <label className="text-sm font-medium">CPF</label>
              <Input
                name="cpf"
                defaultValue={profile.cpf || ""}
                required
                pattern="\d{11}"
                maxLength={11}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Função</label>
              <Input
                name="position_title"
                defaultValue={profile.position_title || ""}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Posto de Trabalho</label>
              <Input
                name="workplace"
                defaultValue={profile.workplace || ""}
                required
              />
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
            <div className="flex items-center gap-2">
              <UserRound className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Nome</p>
                <p className="text-sm text-muted-foreground">{profile.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <UserRound className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">CPF</p>
                <p className="text-sm text-muted-foreground">{profile.cpf}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Função</p>
                <p className="text-sm text-muted-foreground">
                  {profile.position_title}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Posto de Trabalho</p>
                <p className="text-sm text-muted-foreground">{profile.workplace}</p>
              </div>
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
