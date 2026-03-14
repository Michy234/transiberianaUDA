import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  publicDir: 'public',
  server: {
    port: 5173,
    proxy: {
      '/api/arduino-update': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/api/viaggiatreno': {
        target: 'https://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/viaggiatreno/, ''),
      },
    },
  },
  preview: {
    proxy: {
      '/api/viaggiatreno': {
        target: 'https://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/viaggiatreno/, ''),
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
