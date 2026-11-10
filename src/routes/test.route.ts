import { Router } from 'express';
import { reiniciarPedidos } from '../services/pedidos.service.js';
import { productos, crearProductosDePrueba } from '../data/productosCafe.js';

export const testRouter = Router();

testRouter.post('/reset', (_req, res) => {
    reiniciarPedidos();
    res.status(200).json({ ok: true });
});

testRouter.post('/seed', (_req, res) => {
    reiniciarPedidos();
    productos.splice(0, productos.length, ...crearProductosDePrueba());
    res.status(200).json({ ok: true, productos: productos.length });
});
