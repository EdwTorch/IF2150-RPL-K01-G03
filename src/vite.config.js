import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      // Memetakan simbol '@/' secara mutlak langsung ke folder src di root luar
      '@': path.resolve(__dirname, '../src'),
    },
  },
  test: {
    environment: 'node',
    include: ['test/**/*.{test,spec}.{js,ts,jsx,tsx}'], 
  },
});