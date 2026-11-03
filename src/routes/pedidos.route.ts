import { Router, Request, Response, NextFunction } from 'express';
import { crearPedido, ItemEntrada, pedidos } from '../services/pedidos.service.js';

export const pedidosRouter = Router();

// GET /pedidos te devuelve todos los pedidos
pedidosRouter.get('/', (_req: Request, res: Response) => {
  res.status(200).json(pedidos);
});

// GET /pedidos/:id te devuelve un pedido por su id
pedidosRouter.get('/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ error: 'El id debe ser un número' });
    return;
  }

  const pedido = pedidos.find((p) => p.id === id);

  if (!pedido) {
    res.status(404).json({ error: 'Pedido no encontrado' });
    return;
  }

  res.status(200).json(pedido);
});

// POST /pedidos - Crea un nuevo pedido
pedidosRouter.post('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { items, mesaID } = req.body ?? {};

    if (!Array.isArray(items)) {
      res.status(400).json({ error: 'items debe ser un array' });
      return;
    }

    if (mesaID !== undefined && (typeof mesaID !== 'number' || !Number.isInteger(mesaID) || mesaID <= 0)) {
      res.status(400).json({ error: 'mesaID debe ser un número entero positivo' });
      return;
    }

    const nuevoPedido = crearPedido(items as ItemEntrada[], mesaID);

    res.status(201).json(nuevoPedido);
  } catch (error: any) {
    next(error);
  }
})