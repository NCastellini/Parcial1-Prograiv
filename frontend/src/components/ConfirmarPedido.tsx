import { useState } from 'react';
import { api } from '../api/client';

// Item del carrito tal como lo produce el reducer (feature/carrito).
export type ItemCarrito = {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
};

type Props = {
  items: ItemCarrito[];
  mesa: number | null;
};

export default function ConfirmarPedido({ items }: Props) {
  const [enviando, setEnviando] = useState(false);

  async function confirmar() {
    setEnviando(true);

    await api.crearPedido(
      items.map((item) => ({ productoId: item.id, cantidad: item.cantidad })),
    );

    setEnviando(false);
  }

  return (
    <button
      type="button"
      className="btn btn-success"
      disabled={enviando}
      onClick={() => void confirmar()}
    >
      Confirmar pedido
    </button>
  );
}
