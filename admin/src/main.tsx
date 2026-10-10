import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { TranslationProvider } from './i18n/TranslationContext';
import { Toaster } from 'sonner';
import 'leaflet/dist/leaflet.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TranslationProvider>
      <AuthProvider>
        <Toaster position="top-right" richColors theme="dark" closeButton />
        <App />
      </AuthProvider>
    </TranslationProvider>
  </React.StrictMode>,
);
