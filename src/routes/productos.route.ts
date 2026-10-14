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

// GET /productos/:id te devuelve un producto por su id
productosRouter.get('/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ error: 'El id debe ser un número' });
    return;
  }

  const producto = productos.find((p) => p.id === id);

  if (!producto) {
    res.status(404).json({ error: 'Producto no encontrado' });
    return;
  }

  res.status(200).json({
    id: producto.id,
    nombre: producto.nombre,
    precio: producto.calcularPrecio(),
  });
});
