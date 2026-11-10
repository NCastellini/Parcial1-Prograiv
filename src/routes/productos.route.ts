import { Router, type Request, type Response } from 'express';
import { productos } from '../data/productosCafe.js';
import { Expreso } from '../models/Expreso.js';
import { Filtrado } from '../models/Filtrado.js';
import { Pasteleria } from '../models/Pasteleria.js';
import type { Producto } from '../models/Producto.js';
import type { VariedadCafe } from '../data/preciosData.js';

export const productosRouter = Router();

const descripcionesVariedad: Record<VariedadCafe, string> = {
  Brasil: 'Acidez baja, cuerpo alto y notas a chocolate y nueces',
  Colombia: 'Acidez media, cuerpo equilibrado y notas cítricas y florales',
  Etiopía: 'Acidez alta, cuerpo ligero y notas frutales y florales',
};

function serializarProducto(producto: Producto) {
  const base = {
    id: producto.id,
    nombre: producto.nombre,
    precio: producto.calcularPrecio(),
  };

  if (producto instanceof Expreso) {
    return {
      ...base,
      tipo: 'expreso' as const,
      tamanio: producto.tamanio,
      variedad: {
        nombre: producto.variedad,
        descripcion: descripcionesVariedad[producto.variedad],
      },
    };
  }

  if (producto instanceof Filtrado) {
    return {
      ...base,
      tipo: 'filtrado' as const,
      tamanio: producto.tamanio,
      variedad: {
        nombre: producto.variedad,
        descripcion: descripcionesVariedad[producto.variedad],
      },
    };
  }

  if (producto instanceof Pasteleria) {
    return {
      ...base,
      tipo: 'pasteleria' as const,
    };
  }

  throw new Error('Tipo de producto desconocido');
}

// GET /productos
productosRouter.get('/', (_req: Request, res: Response) => {
  res.status(200).json(productos.map(serializarProducto));
});

// GET /productos/:id
productosRouter.get('/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    res.status(400).json({ error: 'El id debe ser un número' });
    return;
  }

  const producto = productos.find((p) => p.id === id);

  if (!producto) {
    res.status(404).json({ error: 'Producto no encontrado' });
    return;
  }

  res.status(200).json(serializarProducto(producto));
});