import { useState } from 'react';
import { api } from '../api/client';
import type { Pedido } from '../api/schemas';

type Props = {
  pedidoId: number;
};

export default function SeguimientoPedido({ pedidoId }: Props) {
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [consultando, setConsultando] = useState(false);

  async function consultar() {
    setConsultando(true);

    setPedido(await api.obtenerPedido(pedidoId));

    setConsultando(false);
  }

  return (
    <section aria-label="Seguimiento del pedido">
      <button
        type="button"
        className="btn btn-outline-primary"
        disabled={consultando}
        onClick={() => void consultar()}
      >
        Consultar estado
      </button>

      {pedido && (
        <p className="mt-3 mb-0" role="status">
          Estado: {pedido.estado}
        </p>
      )}
    </section>
  );
}
