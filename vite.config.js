import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  base: '/', // ✅ IMPORTANTE: así debe estar para dominio personalizado
  build: {
    outDir: 'dist',
  },
});
