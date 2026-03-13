import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  publicDir: 'public',
  server: {
    port: 5173,
    proxy: {
      '/api/arduino-update': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        storia: resolve(__dirname, 'storia.html'),
        fermate: resolve(__dirname, 'fermate.html'),
        salire: resolve(__dirname, 'come-salire.html'),
        info: resolve(__dirname, 'info-utili.html'),
        meteo: resolve(__dirname, 'meteo.html'),
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
});
