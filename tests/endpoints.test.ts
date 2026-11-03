import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { reiniciarPedidos } from '../src/services/pedidos.service.js';

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