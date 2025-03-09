
import { Loader2 } from "lucide-react";

export const LoadingIndicator = () => {
  return (
    <div className="flex justify-center items-center py-8" role="status" aria-live="polite">
      <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
      <span className="ml-2">Verificando autenticação...</span>
    </div>
  );
};
