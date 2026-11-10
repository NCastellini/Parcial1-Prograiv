import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

export default async function configurarServidores() {
  process.env.NODE_ENV = 'test';
  process.env.VITE_API_TARGET = 'http://127.0.0.1:3001';

  // El backend compilado se importa después de activar NODE_ENV=test.
  const { app } = await import('../../dist/app.js');
  const backend = app.listen(3001, '127.0.0.1');
  await new Promise<void>((resolve, reject) => {
    backend.once('listening', resolve);
    backend.once('error', reject);
  });

  const frontend = await createServer({
    root: fileURLToPath(new URL('../', import.meta.url)),
    configFile: fileURLToPath(new URL('../vite.config.ts', import.meta.url)),
    server: { host: '127.0.0.1', port: 5174, strictPort: true },
  });
  try {
    await frontend.listen();
  } catch (error) {
    backend.close();
    throw error;
  }

  return async () => {
    await frontend.close();
    await new Promise<void>((resolve, reject) => {
      backend.close((error) => error ? reject(error) : resolve());
    });
  };
}
