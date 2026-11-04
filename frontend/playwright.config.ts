import { defineConfig } from '@playwright/test';

// Los recorridos E2E y sus fixtures reset/seed se agregarán en feature/tests-e2e.
export default defineConfig({ testDir: './e2e', use: { baseURL: 'http://localhost:5173' } });
