import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Si usás dominio propio, esto evita rutas rotas
  build: {
    outDir: 'dist',
  },
});
