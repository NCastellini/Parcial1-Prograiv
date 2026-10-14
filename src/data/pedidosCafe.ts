export type EstadoPedido = 'pendiente' | 'completado' | 'cancelado';

export interface ItemPedido {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

export interface Pedido {
  id: number;
  items: ItemPedido[];
  estado: EstadoPedido;
  total: number;
}

// arreglo que se comparte entre todos los módulos
export const pedidos: Pedido[] = [];
