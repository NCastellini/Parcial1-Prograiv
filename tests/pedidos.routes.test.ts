import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { pedidos } from '../src/services/pedidos.service.js';

// limpia los pedidos antes de cada test para evitar interferencias
beforeEach(() => {
  pedidos.length = 0;
});

// GET /pedidos
describe('GET /pedidos', () => {

  test('responde 200 y devuelve un array vacío cuando no hay pedidos', async () => {
    const res = await request(app).get('/pedidos');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('devuelve los pedidos existentes', async () => {
    // carga directa de un pedido para simular
    pedidos.push({
      id: 1,
      items: [{ productoId: 1, cantidad: 2, precioUnitario: 5020 }],
      estado: 'pendiente',
      total: 10040,
    });

    const res = await request(app).get('/pedidos');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].id).toBe(1);
  });

});

// GET /pedidos/:id
describe('GET /pedidos/:id', () => {

  test('responde 404 cuando el pedido no existe', async () => {
    const res = await request(app).get('/pedidos/1');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  test('responde 200 y devuelve el pedido correcto', async () => {
    pedidos.push({
      id: 42,
      items: [{ productoId: 7, cantidad: 1, precioUnitario: 2500 }],
      estado: 'completado',
      total: 2500,
    });

    const res = await request(app).get('/pedidos/42');

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(42);
    expect(res.body.total).toBe(2500);
  });

  test('responde 400 si el id no es un número', async () => {
    const res = await request(app).get('/pedidos/xyz');

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('el pedido devuelto tiene id, items, estado y total', async () => {
    pedidos.push({
      id: 5,
      items: [{ productoId: 2, cantidad: 3, precioUnitario: 7420 }],
      estado: 'pendiente',
      total: 22260,
    });

    const res = await request(app).get('/pedidos/5');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('items');
    expect(res.body).toHaveProperty('estado');
    expect(res.body).toHaveProperty('total');
  });

});