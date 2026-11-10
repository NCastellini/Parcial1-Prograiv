import { useState } from 'react';
import { api } from '../api/client';
import type { Pedido } from '../api/schemas';

// Item del carrito tal como lo produce el reducer (feature/carrito).
export type ItemCarrito = {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
};

type EstadoConfirmacion =
  | { estado: 'inicial' }
  | { estado: 'enviando' }
  | { estado: 'confirmado'; pedido: Pedido };

type Props = {
  items: ItemCarrito[];
  mesa: number | null;
};

export default function ConfirmarPedido({ items, mesa }: Props) {
  const [estado, setEstado] = useState<EstadoConfirmacion>({
    estado: 'inicial',
  });

  async function confirmar() {
    setEstado({ estado: 'enviando' });

    const pedido = await api.crearPedido(
      items.map((item) => ({ productoId: item.id, cantidad: item.cantidad })),
      mesa === null ? undefined : mesa,
    );

    setEstado({ estado: 'confirmado', pedido });
  }

  if (estado.estado === 'confirmado') {
    return (
      <section aria-label="Confirmación del pedido">
        <p className="fw-bold mb-0">Pedido #{estado.pedido.id}</p>
        <p className="mb-0">Estado: {estado.pedido.estado}</p>
      </section>
    );
  }

  return (
    <button
      type="button"
      className="btn btn-success"
      disabled={estado.estado === 'enviando'}
      onClick={() => void confirmar()}
    >
      Confirmar pedido
    </button>
  );
}
