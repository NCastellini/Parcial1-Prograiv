import { useState } from 'react';
import { api, ApiError } from '../api/client';
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
  | { estado: 'confirmado'; pedido: Pedido }
  | { estado: 'error'; mensaje: string; reintentable: boolean };

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

    try {
      const pedido = await api.crearPedido(
        items.map((item) => ({ productoId: item.id, cantidad: item.cantidad })),
        mesa === null ? undefined : mesa,
      );

      setEstado({ estado: 'confirmado', pedido });
    } catch (e) {
      // Los errores de red (fetch rechazado) u otros errores inesperados
      // no tienen un mensaje útil para el usuario: mostramos uno genérico.
      const mensaje =
        e instanceof ApiError
          ? e.message
          : 'No se pudo conectar con el servidor. Intentá de nuevo en unos minutos.';

      setEstado({
        estado: 'error',
        mensaje,
        // Un 5xx es transitorio del lado del servidor: se puede reintentar.
        reintentable: e instanceof ApiError && e.status >= 500,
      });
    }
  }

  if (estado.estado === 'error') {
    return (
      <section aria-label="Error al confirmar el pedido">
        <p className="text-danger mb-2" role="alert">
          {estado.mensaje}
        </p>
        <p className="mb-1 fst-italic">Tu carrito se conservó:</p>
        <ul className="mb-2">
          {items.map((item) => (
            <li key={item.id}>
              <span>{item.nombre}</span>{' '}
              <span className="text-muted">× {item.cantidad}</span>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="btn btn-success"
          onClick={() => void confirmar()}
        >
          {estado.reintentable ? 'Reintentar' : 'Confirmar pedido'}
        </button>
      </section>
    );
  }

  if (estado.estado === 'confirmado') {
    return (
      <section aria-label="Confirmación del pedido">
        <p className="fw-bold mb-0">Pedido #{estado.pedido.id}</p>
        <p className="mb-0">Estado: {estado.pedido.estado}</p>
        <p className="mb-0">
          Total: ${estado.pedido.total.toLocaleString('es-AR')}
        </p>
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
