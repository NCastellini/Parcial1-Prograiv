import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.ts', 'src/**/*.test.ts'],
    exclude: ['frontend/**', '**/node_modules/**', '**/dist/**'],
    setupFiles: ['./tests/setup.ts'],
  },
});