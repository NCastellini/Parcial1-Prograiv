import { Router } from 'express';
import { reiniciarPedidos } from '../services/pedidos.service.js';

export const testRouter = Router();

testRouter.post('/reset', (_req, res) => {
    reiniciarPedidos();
    res.status(200).json({ ok: true });
});