import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import mkcert from 'vite-plugin-mkcert';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mkcert()],
  build: {
    sourcemap: true,
  },
  server: {
    https: true,
    host: true, // щоб був доступ з телефону
  },
});
