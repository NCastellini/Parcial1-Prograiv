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

  test('cada producto tiene id, nombre y precio', async () => {
    const res = await request(app).get('/productos');

    for (const producto of res.body) {
      expect(producto).toHaveProperty('id');
      expect(producto).toHaveProperty('nombre');
      expect(producto).toHaveProperty('precio');
    }
  });

  test('el precio de cada producto es un número positivo', async () => {
    const res = await request(app).get('/productos');

    for (const producto of res.body) {
      expect(typeof producto.precio).toBe('number');
      expect(producto.precio).toBeGreaterThan(0);
    }
  });

});

// GET /productos/:id
describe('GET /productos/:id', () => {

  test('responde 200 y devuelve el producto correcto', async () => {
    const res = await request(app).get('/productos/1');

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body).toHaveProperty('nombre');
    expect(res.body).toHaveProperty('precio');
  });

  test('responde 404 si el producto no existe', async () => {
    const res = await request(app).get('/productos/9999');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  test('responde 400 si el id no es un número', async () => {
    const res = await request(app).get('/productos/abc');

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('el precio del producto 1 (Expreso Brasil Pocillo) es 5020', async () => {
    const res = await request(app).get('/productos/1');

    expect(res.status).toBe(200);
    expect(res.body.precio).toBe(5020);
  });

});
