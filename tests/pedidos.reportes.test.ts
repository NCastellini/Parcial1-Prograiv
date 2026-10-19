import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { reiniciarPedidos } from '../src/services/pedidos.service.js';

describe('Endpoints de Pedidos y Reportes', () => {

  // Limpiamos los pedidos antes de cada test para mantener un estado aislado
  beforeEach(() => {
    reiniciarPedidos();
  });

  // POST /pedidos
  describe('POST /pedidos', () => {

    test('responde 201 y crea un pedido exitosamente', async () => {
      const nuevoPedido = [
        { productoId: 1, cantidad: 2 }
      ];

      const res = await request(app)
        .post('/pedidos')
        .send(nuevoPedido);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.estado).toBe('pendiente');
      expect(res.body.items).toHaveLength(1);
      expect(res.body.total).toBe(10040); // 5020 (precio prod 1) * 2
    });

    test('responde 400 si el array de items esta vacio', async () => {
      const res = await request(app)
        .post('/pedidos')
        .send([]);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    test('responde 400 si se envía un producto que no existe', async () => {
      const res = await request(app)
        .post('/pedidos')
        .send([{ productoId: 9999, cantidad: 1 }]);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    test('responde 400 si la cantidad es invalida (cero o negativa)', async () => {
      const res = await request(app)
        .post('/pedidos')
        .send([{ productoId: 1, cantidad: 0 }]);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

  });

  // GET /reportes/facturacion
  describe('GET /reportes/facturacion', () => {

    test('responde 200 y calcula correctamente la facturación total', async () => {
      // Creamos dos pedidos: 
      // 1) Cantidad 1 del producto 1 -> 5020
      // 2) Cantidad 2 del producto 1 -> 10040
      // Total esperado: 15060
      await request(app).post('/pedidos').send([{ productoId: 1, cantidad: 1 }]);
      await request(app).post('/pedidos').send([{ productoId: 1, cantidad: 2 }]);

      const res = await request(app).get('/reportes/facturacion');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('facturacionTotal');
      expect(res.body.facturacionTotal).toBe(15060);
    });

    test('responde 200 y facturación total en 0 si no hay pedidos', async () => {
      const res = await request(app).get('/reportes/facturacion');

      expect(res.status).toBe(200);
      expect(res.body.facturacionTotal).toBe(0);
    });

  });

  // GET /reportes/mas-vendido
  describe('GET /reportes/mas-vendido', () => {

    test('responde 200 y devuelve el producto mas vendido correctamente', async () => {
      // Creamos un pedido con mayor cantidad del producto 1
      await request(app).post('/pedidos').send([{ productoId: 1, cantidad: 3 }]);
      await request(app).post('/pedidos').send([{ productoId: 2, cantidad: 1 }]);

      const res = await request(app).get('/reportes/mas-vendido');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('productos');
      expect(res.body).toHaveProperty('cantidad', 3);
      expect(Array.isArray(res.body.productos)).toBe(true);
      expect(res.body.productos.length).toBeGreaterThan(0);
    });

    test('responde 200 con estructura vacia si no hay pedidos', async () => {
      const res = await request(app).get('/reportes/mas-vendido');

      expect(res.status).toBe(200);
      expect(res.body.productos).toEqual([]);
      expect(res.body.cantidad).toBe(0);
    });

  });

});