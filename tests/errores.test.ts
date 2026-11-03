import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { reiniciarPedidos } from '../src/services/pedidos.service.js';

beforeEach(() => reiniciarPedidos());

describe('Errores estandarizados', () => {
    test('mesa inexistente responde 400 con { "error": "..." }', async () => {
        const res = await request(app)
            .post('/pedidos')
            .send({ items: [{ productoId: 1, cantidad: 1 }], mesaID: 9999 });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: expect.any(String) });
    });
});