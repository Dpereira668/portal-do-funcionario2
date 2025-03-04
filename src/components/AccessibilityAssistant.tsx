
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, ZoomIn, ZoomOut, Sun, Moon } from 'lucide-react';
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
  const [fontSize, setFontSize] = useState(100); // 100% is default
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
        variant: "default",
      });

      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(url);
        toast({
          title: "Leitura finalizada",
          description: "A leitura do conteúdo foi concluída",
          variant: "default",
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

  const handleReadClick = () => {
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

  const increaseFontSize = () => {
    if (fontSize < 150) { // Max 150%
      const newSize = fontSize + 10;
      setFontSize(newSize);
      document.documentElement.style.fontSize = `${newSize}%`;
      localStorage.setItem('a11y-font-size', newSize.toString());
      toast({
        title: "Tamanho da fonte aumentado",
        description: `Novo tamanho: ${newSize}%`,
      });
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 80) { // Min 80%
      const newSize = fontSize - 10;
      setFontSize(newSize);
      document.documentElement.style.fontSize = `${newSize}%`;
      localStorage.setItem('a11y-font-size', newSize.toString());
      toast({
        title: "Tamanho da fonte diminuído",
        description: `Novo tamanho: ${newSize}%`,
      });
    }
  };

  // Load saved font size on component mount
  useEffect(() => {
    const savedFontSize = localStorage.getItem('a11y-font-size');
    if (savedFontSize) {
      const size = parseInt(savedFontSize);
      setFontSize(size);
      document.documentElement.style.fontSize = `${size}%`;
    }
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-12 w-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all"
        onClick={handleReadClick}
        title={isPlaying ? "Parar leitura" : "Ler conteúdo"}
        aria-label={isPlaying ? "Parar leitura" : "Ler conteúdo"}
      >
        {isPlaying ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="h-12 w-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all"
        onClick={increaseFontSize}
        title="Aumentar fonte"
        aria-label="Aumentar tamanho da fonte"
      >
        <ZoomIn className="h-6 w-6" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="h-12 w-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all"
        onClick={decreaseFontSize}
        title="Diminuir fonte"
        aria-label="Diminuir tamanho da fonte"
      >
        <ZoomOut className="h-6 w-6" />
      </Button>
    </div>
  );
};
