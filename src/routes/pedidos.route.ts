import { Router, Request, Response } from 'express';
import { pedidos } from '../data/pedidosCafe.js';

export const pedidosRouter = Router();

// GET /pedidos te devuelve todos los pedidos
pedidosRouter.get('/', (_req: Request, res: Response) => {
  res.status(200).json(pedidos);
});