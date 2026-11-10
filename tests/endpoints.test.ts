import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { reiniciarPedidos } from '../src/services/pedidos.service.js';
import { productos } from '../src/data/productosCafe.js';

beforeEach(() => reiniciarPedidos());

describe('POST /__test__/reset', () => {
    test('limpia los pedidos', async () => {
        await request(app).post('/pedidos').send({ items: [{ productoId: 1, cantidad: 1 }] });
        expect((await request(app).get('/pedidos')).body).toHaveLength(1);

        const res = await request(app).post('/__test__/reset');

        expect(res.status).toBe(200);
        expect((await request(app).get('/pedidos')).body).toEqual([]);
    });
});

describe('POST /__test__/seed', () => {
    test('carga productos de prueba', async () => {
        const res = await request(app).post('/__test__/seed');
        expect(res.status).toBe(200);

        const productos = await request(app).get('/productos');
        expect(productos.body.length).toBeGreaterThan(0);

        const uno = await request(app).get('/productos/1');
        expect(uno.body.precio).toBe(5020);
    });

    test('restaura el catálogo que consultan productos y pedidos', async () => {
        const originales = [...productos];
        try {
            productos.splice(0, productos.length);
            expect((await request(app).get('/productos')).body).toEqual([]);

            const res = await request(app).post('/__test__/seed');
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ ok: true, productos: 20 });

            const catalogo = (await request(app).get('/productos')).body;
            expect(catalogo).toHaveLength(20);
            expect(new Set(catalogo.map((p: { id: number }) => p.id)).size).toBe(20);

            const pedido = await request(app).post('/pedidos').send({
                items: [{ productoId: 20, cantidad: 1 }],
            });
            expect(pedido.status).toBe(201);

            await request(app).post('/__test__/seed');
            expect((await request(app).get('/productos')).body).toHaveLength(20);
            expect((await request(app).get('/pedidos')).body).toEqual([]);
        } finally {
            productos.splice(0, productos.length, ...originales);
            reiniciarPedidos();
        }
    });
});
