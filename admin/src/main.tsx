import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'sonner';
import 'leaflet/dist/leaflet.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <Toaster position="top-right" richColors theme="dark" closeButton />
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
