import { z } from 'zod';
import { ErrorSchema, PedidoSchema, ProductoSchema, ProductosSchema } from './schemas';

// Todas las llamadas HTTP deben pasar por este módulo. El proxy de Vite usa rutas relativas.
async function solicitar<T>(ruta: string, schema: z.ZodType<T>, opciones?: RequestInit): Promise<T> {
  const respuesta = await fetch(ruta, opciones);
  const cuerpo: unknown = await respuesta.json();
  if (!respuesta.ok) {
    const error = ErrorSchema.safeParse(cuerpo);
    throw new Error(error.success ? error.data.error : `Error HTTP ${respuesta.status}`);
  }
  return schema.parse(cuerpo);
}

export const api = {
  obtenerProductos: () => solicitar('/productos', ProductosSchema),
  obtenerProducto: (id: number) => solicitar(`/productos/${id}`, ProductoSchema),
  obtenerPedido: (id: number) => solicitar(`/pedidos/${id}`, PedidoSchema),
  crearPedido: (items: { productoId: number; cantidad: number }[], mesaID?: number) =>
    solicitar('/pedidos', PedidoSchema, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items, ...(mesaID === undefined ? {} : { mesaID }) }) }),
};
