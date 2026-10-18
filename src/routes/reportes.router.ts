import { Router, Request, Response } from 'express';
import { ReportesService } from '../services/reportes.service.js';
import { pedidos } from '../services/pedidos.service.js';

export const reportesRouter = Router();

// GET /reportes/facturacion - Devuelve la facturacion total
reportesRouter.get('/facturacion', (_req: Request, res: Response) => {
  try {
    const facturacionTotal = ReportesService.calcularFacturacionTotal(pedidos);
    res.status(200).json({ facturacionTotal });
  } catch (error: any) {
    res.status(500).json({ error: 'Error al calcular la facturacion total', detalle: error.message });
  }
});

// GET /reportes/mas-vendido - Devuelve el o los productos mas vendidos y su cantidad
reportesRouter.get('/mas-vendido', (_req: Request, res: Response) => {
  try {
    const productoMasVendido = ReportesService.obtenerProductoMasVendido(pedidos);
    res.status(200).json(productoMasVendido);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al obtener el producto mas vendido', detalle: error.message });
  }
});