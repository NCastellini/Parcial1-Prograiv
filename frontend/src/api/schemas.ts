import { z } from 'zod';

export const ProductoSchema = z.discriminatedUnion('tipo', [
  z.object({ id: z.number().int(), tipo: z.literal('expreso'), nombre: z.string(), precio: z.number(), tamanio: z.string(), variedad: z.object({ nombre: z.string(), descripcion: z.string() }) }),
  z.object({ id: z.number().int(), tipo: z.literal('filtrado'), nombre: z.string(), precio: z.number(), tamanio: z.string(), variedad: z.object({ nombre: z.string(), descripcion: z.string() }) }),
  z.object({ id: z.number().int(), tipo: z.literal('pasteleria'), nombre: z.string(), precio: z.number() }),
]);
export const ProductosSchema = z.array(ProductoSchema);
export const ItemPedidoSchema = z.object({ productoId: z.number().int(), cantidad: z.number().int().positive(), precioUnitario: z.number() });
export const PedidoSchema = z.object({ id: z.number().int(), estado: z.string(), items: z.array(ItemPedidoSchema), total: z.number(), mesaID: z.number().int().optional() });
export const ErrorSchema = z.object({ error: z.string() });

export type Producto = z.infer<typeof ProductoSchema>;
export type Pedido = z.infer<typeof PedidoSchema>;
export type ErrorApi = z.infer<typeof ErrorSchema>;
