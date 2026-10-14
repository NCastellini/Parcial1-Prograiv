import { describe, test, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

// GET /productos
describe('GET /productos', () => {

  test('responde 200 y devuelve un array', async () => {
    const res = await request(app).get('/productos');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
