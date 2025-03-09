
import React from 'react';
import * as Sentry from '@sentry/react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface FallbackProps {
  error: Error;
  eventId: string;
  resetError(): void;
}

const ErrorFallback: React.FC<FallbackProps> = ({ error, resetError }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-destructive/5">
      <div className="w-full max-w-md p-8 space-y-6 bg-background rounded-lg shadow-lg border border-destructive/20">
        <div className="flex items-center justify-center">
          <AlertTriangle className="h-12 w-12 text-destructive" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-center text-destructive">Algo deu errado</h1>
        <div className="p-4 bg-destructive/10 rounded-md border border-destructive/20">
          <p className="text-sm font-mono break-all">{error.message || 'Ocorreu um erro inesperado.'}</p>
        </div>
        <p className="text-sm text-center text-muted-foreground">
          O erro foi registrado e nossa equipe técnica foi notificada.
        </p>
        <div className="flex justify-center">
          <Button onClick={resetError} variant="outline">
            Tentar novamente
          </Button>
        </div>
      </div>
    </div>
  );
};

// Higher Order Component for Sentry Error Boundary
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  options?: Sentry.ErrorBoundaryProps
) => {
  return (props: P) => (
    <Sentry.ErrorBoundary
      fallback={({ error, eventId, resetError }) => (
        <ErrorFallback error={error} eventId={eventId} resetError={resetError} />
      )}
      {...options}
    >
      <Component {...props} />
    </Sentry.ErrorBoundary>
  );
};

export default withErrorBoundary;
