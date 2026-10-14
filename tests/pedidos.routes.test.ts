import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { pedidos } from '../src/data/pedidosCafe.js';

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