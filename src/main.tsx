
import { createRoot } from 'react-dom/client'
import * as Sentry from '@sentry/react';
import App from './App.tsx'
import './index.css'

// Initialize Sentry
// Replace 'https://your-sentry-dsn' with your actual Sentry DSN
Sentry.init({
  dsn: "https://examplePublicKey@o0.ingest.sentry.io/0",  // Replace with your actual DSN
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
  // Capture 100% of transactions for performance monitoring in development
  // In production, you might want to lower this
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
  // Capture 10% of session replays in production
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0, 
  replaysOnErrorSampleRate: 1.0, // Capture all sessions with errors
});

createRoot(document.getElementById("root")!).render(<App />);
