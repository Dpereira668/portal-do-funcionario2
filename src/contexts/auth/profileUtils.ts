
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import * as Sentry from '@sentry/react';

export async function ensureProfile(
  user: User, 
  setUserProfile: (profile: any) => void, 
  setIsAdmin: (isAdmin: boolean) => void
) {
  console.log("Verificando existência do perfil para:", user.id);
  const { toast } = useToast();
  
  try {
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error("Erro ao verificar perfil:", fetchError);
      return;
    }

    if (!profile) {
      console.log("Perfil não encontrado, criando novo perfil...");
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([{
          id: user.id,
          email: user.email,
          role: 'funcionario',
          user_type: 'funcionario'
        }]);

      if (insertError) {
        console.error("Erro ao criar perfil:", insertError);
        
        Sentry.captureException(insertError, {
          tags: {
            action: 'create_profile'
          },
          extra: {
            userId: user.id
          }
        });
        
        toast({
          title: "Erro ao criar perfil",
          description: "Não foi possível criar seu perfil. Por favor, tente novamente.",
          variant: "destructive",
        });
      } else {
        console.log("Perfil criado com sucesso");
        
        Sentry.addBreadcrumb({
          category: 'profile',
          message: 'Profile created successfully',
          level: 'info'
        });
        
        toast({
          title: "Perfil criado",
          description: "Seu perfil foi criado com sucesso!",
        });
        
        const { data: newProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        setUserProfile(newProfile);
        setIsAdmin(newProfile?.role === 'admin' || newProfile?.user_type === 'admin');
      }
    } else {
      console.log("Perfil existente encontrado:", profile);
      setUserProfile(profile);
      setIsAdmin(profile.role === 'admin' || profile.user_type === 'admin');
    }
  } catch (error) {
    console.error("Erro ao processar perfil:", error);
    Sentry.captureException(error, {
      tags: {
        action: 'process_profile'
      }
    });
  }
}
