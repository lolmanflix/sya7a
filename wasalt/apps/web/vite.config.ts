import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@wasalt/types': path.resolve(__dirname, '../../packages/types/src'),
      '@wasalt/config': path.resolve(__dirname, '../../packages/config/src'),
      '@wasalt/theme': path.resolve(__dirname, '../../packages/theme/src'),
      '@wasalt/validation': path.resolve(__dirname, '../../packages/validation/src'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5174,
  },
});
