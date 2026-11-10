import { useCallback, useReducer, useState } from 'react';
import Header from './components/Header';
import Menu from './components/Menu';
import ConfirmarPedido, { VistaConfirmacion } from './components/ConfirmarPedido';
import SeguimientoPedido from './components/SeguimientoPedido';
import { carritoReducer } from './carrito/carritoReducer';
import type { Producto, Pedido } from './api/schemas';
import { leerMesaDesdeUrl } from './utils/leerMesaDesdeUrl';

export default function App() {
  const mesa = leerMesaDesdeUrl(window.location.href);
  const [items, dispatch] = useReducer(carritoReducer, []);
  const [pedido, setPedido] = useState<Pedido | null>(null);

  const agregarAlCarrito = useCallback(
    (producto: Producto) => {
      dispatch({
        type: 'AGREGAR',
        payload: {
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          cantidad: 1,
        },
      });
    },
    [],
  );

  return (
    <>
      <Header mesa={mesa} />

      <main className="container py-4">
        {pedido === null ? (
          <>
            <h2>Menú de Cafetería Origen</h2>
            <p>Seleccioná tus productos para hacer un pedido.</p>

            <Menu onAgregar={agregarAlCarrito} />

            {items.length > 0 && (
              <section aria-label="Carrito" className="mt-4">
                <h2 className="h4 mb-3">Tu carrito</h2>
                <ul className="mb-3">
                  {items.map((item) => (
                    <li key={item.id}>
                      <span>{item.nombre}</span>{' '}
                      <span className="text-muted">× {item.cantidad}</span>
                    </li>
                  ))}
                </ul>

                <ConfirmarPedido
                  items={items}
                  mesa={mesa}
                  onConfirmado={setPedido}
                />
              </section>
            )}
          </>
        ) : (
          <>
            <VistaConfirmacion pedido={pedido} />

            <div className="mt-4">
              <SeguimientoPedido pedidoId={pedido.id} />
            </div>
          </>
        )}
      </main>
    </>
  );
}
