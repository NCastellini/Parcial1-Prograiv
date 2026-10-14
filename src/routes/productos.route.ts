import { Router, Request, Response } from 'express';
import { productos } from '../data/productosCafe.js';

export const productosRouter = Router();

// GET /productos te devuelve todos los productos con su precio calculado
productosRouter.get('/', (_req: Request, res: Response) => {
  const resultado = productos.map((p) => ({
    id: p.id,
    nombre: p.nombre,
    precio: p.calcularPrecio(),
  }));

  res.status(200).json(resultado);
});