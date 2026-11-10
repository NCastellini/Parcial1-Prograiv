import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  globalSetup: './e2e/global-setup.ts',
  use: {
    baseURL: 'http://127.0.0.1:5174',
    browserName: 'chromium',
    ...(process.platform === 'win32' ? { channel: 'msedge' as const } : {}),
  },
});
