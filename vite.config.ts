import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@harmony-data': path.resolve(__dirname, 'node_modules/@deltek/harmony-components/src/data'),
    },
  },
});
