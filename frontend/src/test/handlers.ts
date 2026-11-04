import { http, HttpResponse } from 'msw';

// Contratos simulados para los tests de integración con TDD.
// Ejemplo de MSW 2: http.get('/productos', () => HttpResponse.json([]))
export const handlers = [
  http.get('/__setup__/health', () => HttpResponse.json({ ok: true })),
];
