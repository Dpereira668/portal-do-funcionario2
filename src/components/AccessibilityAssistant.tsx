
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
      setIsPlaying(true);

      const { data, error } = await supabase.functions.invoke<TTSResponse>('text-to-speech', {
        body: { text, voice: 'onyx' }
      });

      if (error || !data?.audioContent) {
        throw new Error(error?.message || 'Falha ao gerar áudio');
      }

      // Convert base64 to blob URL
      const blob = await fetch(`data:audio/mp3;base64,${data.audioContent}`).then(r => r.blob());
      const url = URL.createObjectURL(blob);

      // Stop any current audio
      audio.pause();
      audio.src = url;

      // Clean up old blob URL
      const oldUrl = audio.src;
      audio.onloadeddata = () => {
        if (oldUrl.startsWith('blob:')) {
          URL.revokeObjectURL(oldUrl);
        }
      };

      // Play new audio
      await audio.play();
      
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(url);
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
    setIsPlaying(false);
  };

  const handleClick = () => {
    if (isPlaying) {
      stopReading();
      return;
    }

    // Get visible text content from the main content area
    const mainContent = document.querySelector('main');
    if (mainContent) {
      const text = mainContent.textContent?.trim();
      if (text) {
        readText(text);
      }
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all"
      onClick={handleClick}
      title={isPlaying ? "Parar leitura" : "Ler conteúdo"}
    >
      {isPlaying ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
    </Button>
  );
};
