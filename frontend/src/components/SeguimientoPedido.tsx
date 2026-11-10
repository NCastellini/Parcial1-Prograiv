import { useState } from 'react';
import { api, ApiError } from '../api/client';
import type { Pedido } from '../api/schemas';

type Props = {
  pedidoId: number;
};

export default function SeguimientoPedido({ pedidoId }: Props) {
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [consultando, setConsultando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function consultar() {
    setConsultando(true);
    setError(null);
    try {
      setPedido(await api.obtenerPedido(pedidoId));
    } catch (fallo) {
      setError(fallo instanceof ApiError
        ? fallo.message
        : 'No se pudo consultar el pedido. Intentá nuevamente.');
    } finally {
      setConsultando(false);
    }
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

      {error && <p className="text-danger mt-2" role="alert">{error}</p>}

      {pedido && (
        <p className="mt-3 mb-0" role="status">
          Estado: {pedido.estado}
        </p>
      )}
    </section>
  );
}
