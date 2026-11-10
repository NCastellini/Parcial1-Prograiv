import { useState } from 'react';
import { api } from '../api/client';

type Props = {
  pedidoId: number;
};

export default function SeguimientoPedido({ pedidoId }: Props) {
  const [consultando, setConsultando] = useState(false);

  async function consultar() {
    setConsultando(true);

    await api.obtenerPedido(pedidoId);

    setConsultando(false);
  }

  return (
    <button
      type="button"
      className="btn btn-outline-primary"
      disabled={consultando}
      onClick={() => void consultar()}
    >
      Consultar estado
    </button>
  );
}
