import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 5173 },
  // three.js lives in the lazy HeroCanvas chunk, loaded only when 3D is allowed.
  build: { chunkSizeWarningLimit: 1000 },
});
