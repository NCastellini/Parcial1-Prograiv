import { defineConfig } from '@playwright/test';

// URL del frontend bajo prueba (baseURL de los tests E2E).
const FRONT_URL = 'http://localhost:5173';

// URL de la API real, para los fixtures de reset/seed (/__test__/*).
// El backend solo monta /__test__ cuando corre con NODE_ENV=test,
// por eso el webServer lo levanta con esa variable.
export const API_URL = 'http://localhost:3000';

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: FRONT_URL },
  expect: {
    // Los E2E corren contra la API real: le damos margen a la carga del menú.
    timeout: 10_000,
  },
  webServer: [
    {
      // API en :3000 con los endpoints de reset/seed habilitados.
      // /pedidos/abc responde 400 apenas el servidor acepta conexiones.
      command: 'NODE_ENV=test npx tsx src/index.ts',
      url: `${API_URL}/pedidos/abc`,
      cwd: '..',
      reuseExistingServer: true,
    },
    {
      // Frontend de Vite en :5173 con proxy a la API.
      command: 'npm run dev',
      url: FRONT_URL,
      reuseExistingServer: true,
    },
  ],
});
