
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuthCheck } from '@/hooks/use-auth-check';

interface TTSResponse {
  audioContent: string;
  error?: string;
}

export const AccessibilityAssistant = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio());
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuthCheck();

  const readText = async (text: string) => {
    try {
      if (!isAuthenticated) {
        toast({
          title: "Não autenticado",
          description: "Você precisa estar logado para usar esta funcionalidade",
          variant: "destructive",
        });
        return;
      }

      if (isPlaying) {
        stopReading();
        return;
      }

      setIsPlaying(true);
      toast({
        title: "Iniciando leitura",
        description: "Preparando para ler o conteúdo...",
      });

      console.log('Enviando texto para conversão:', text.substring(0, 100) + '...');

      const { data, error } = await supabase.functions.invoke<TTSResponse>('text-to-speech', {
        body: { 
          text, 
          voice: 'onyx' 
        }
      });

      console.log('Resposta da função:', { data, error });

      if (error || !data?.audioContent) {
        throw new Error(error?.message || data?.error || 'Falha ao gerar áudio');
      }

      // Convert base64 to blob URL
      const blob = await fetch(`data:audio/mp3;base64,${data.audioContent}`).then(r => r.blob());
      const url = URL.createObjectURL(blob);

      // Stop any current audio and clean up
      audio.pause();
      if (audio.src) {
        URL.revokeObjectURL(audio.src);
      }
      audio.src = url;

      // Play new audio
      await audio.play();
      
      toast({
        title: "Leitura iniciada",
        description: "O conteúdo está sendo lido...",
      });

      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(url);
        toast({
          title: "Leitura finalizada",
          description: "A leitura do conteúdo foi concluída",
        });
      };

    } catch (error) {
      console.error('Erro ao reproduzir texto:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível reproduzir o texto no momento",
        variant: "destructive",
      });
      setIsPlaying(false);
    }
  };

  const stopReading = () => {
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    toast({
      title: "Leitura interrompida",
      description: "A leitura foi interrompida",
    });
  };

  const handleClick = () => {
    if (isLoading) {
      toast({
        title: "Carregando",
        description: "Aguarde enquanto verificamos sua autenticação",
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Não autenticado",
        description: "Você precisa estar logado para usar esta funcionalidade",
        variant: "destructive",
      });
      return;
    }

    if (isPlaying) {
      stopReading();
      return;
    }

    // Get visible text content from the main content area
    const mainContent = document.querySelector('main');
    if (mainContent) {
      const visibleText = Array.from(mainContent.querySelectorAll('*'))
        .filter((element: Element) => {
          const style = window.getComputedStyle(element);
          return style.display !== 'none' && 
                 style.visibility !== 'hidden' && 
                 element.textContent?.trim();
        })
        .map(element => element.textContent)
        .join(' ')
        .trim();

      if (visibleText) {
        readText(visibleText);
      } else {
        toast({
          title: "Sem conteúdo",
          description: "Não há conteúdo visível para ler nesta página",
        });
      }
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed bottom-20 right-4 h-12 w-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all z-50"
      onClick={handleClick}
      title={isPlaying ? "Parar leitura" : "Ler conteúdo"}
      aria-label={isPlaying ? "Parar leitura" : "Ler conteúdo"}
    >
      {isPlaying ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
    </Button>
  );
};

