
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface TTSResponse {
  audioContent: string;
  error?: string;
}

export const AccessibilityAssistant = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio());
  const { toast } = useToast();

  const readText = async (text: string) => {
    try {
      if (isPlaying) {
        stopReading();
        return;
      }

      setIsPlaying(true);
      toast({
        title: "Iniciando leitura",
        description: "Preparando para ler o conteúdo...",
      });

      const { data, error } = await supabase.functions.invoke<TTSResponse>('text-to-speech', {
        body: { text, voice: 'onyx' }
      });

      if (error || !data?.audioContent) {
        throw new Error(error?.message || 'Falha ao gerar áudio');
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
        description: "Não foi possível reproduzir o texto no momento",
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

