import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/productos': process.env.VITE_API_TARGET ?? 'http://localhost:3000',
      '/pedidos': process.env.VITE_API_TARGET ?? 'http://localhost:3000',
    },
  },
});
