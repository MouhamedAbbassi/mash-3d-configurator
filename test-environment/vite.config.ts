import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // This allows importing your library components directly from source
      'mashroom-3d-configurator': path.resolve(__dirname, '../lib')
    }
  }
});