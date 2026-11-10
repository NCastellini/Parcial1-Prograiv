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

test('producto inexistente en pedido responde 404 con { "error": "..." }', async () => {
    const res = await request(app)
        .post('/pedidos')
        .send({ items: [{ productoId: 9999, cantidad: 1 }] });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: expect.any(String) });
});

describe('Body inválido', () => {
    test.each([null, {}, { productoId: '1', cantidad: 1 }, { productoId: 1.5, cantidad: 1 }])(
        'un item inválido %j responde 400', async (item) => {
            const res = await request(app).post('/pedidos').send({ items: [item] });
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: expect.any(String) });
        },
    );

    test('JSON malformado responde 400 con { "error": "..." }', async () => {
        const res = await request(app)
            .post('/pedidos')
            .set('Content-Type', 'application/json')
            .send('{"items": [');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: expect.any(String) });
    });

    test.each([
        ['sin items', {}],
        ['items no es array', { items: 'hola' }],
        ['cantidad no numérica', { items: [{ productoId: 1, cantidad: 'dos' }] }],
        ['mesaID no numérico', { items: [{ productoId: 1, cantidad: 1 }], mesaID: 'abc' }],
    ])('%s responde 400 con { "error": "..." }', async (_caso, body) => {
        const res = await request(app).post('/pedidos').send(body);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: expect.any(String) });
    });

    test('ruta inexistente responde 404 con { "error": "..." }', async () => {
        const res = await request(app).get('/no-existe');

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ error: expect.any(String) });
    });
});
