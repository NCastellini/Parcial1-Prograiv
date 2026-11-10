import { useMenu } from '../hooks/useMenu';
import type { Producto } from '../api/schemas';
import SelectorCafe from './SelectorCafe';
import { TarjetaPasteleria } from '../carrito/TarjetaPasteleria';

type Props = {
  // Con onAgregar el menú pasa a modo armado de pedido: selector de cafés
  // y tarjetas de pastelería con botón para agregar al carrito.
  onAgregar?: (producto: Producto) => void;
};

export default function Menu({ onAgregar }: Props) {
  const { estado, reintentar } = useMenu();

  if (estado.estado === 'cargando') {
    return (
      <section aria-label="Menú">
        <div className="d-flex align-items-center gap-2" role="status">
          <span
            className="spinner-border spinner-border-sm"
            aria-hidden="true"
          />
          <span>Cargando menú...</span>
        </div>
      </section>
    );
  }

  if (estado.estado === 'listo') {
    if (onAgregar !== undefined) {
      const pasteleria = estado.productos.filter(
        (producto) => producto.tipo === 'pasteleria',
      );

      return (
        <section aria-label="Menú">
          <SelectorCafe productos={estado.productos} onAgregar={onAgregar} />

          <h3 className="h5 mt-4">Pastelería</h3>
          <div className="row g-3">
            {pasteleria.map((producto) => (
              <div className="col-12 col-md-6 col-lg-4" key={producto.id}>
                <article className="card h-100">
                  <div className="card-body">
                    <TarjetaPasteleria
                      producto={{
                        id: producto.id,
                        nombre: producto.nombre,
                        precio: producto.precio,
                        tipo: 'pasteleria',
                      }}
                      onAgregar={onAgregar}
                    />
                    <p className="fw-bold mb-0">
                      ${producto.precio.toLocaleString('es-AR')}
                    </p>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </section>
      );
    }

    return (
      <section aria-label="Menú">
        <div className="row g-3">
          {estado.productos.map((producto) => (
            <div className="col-12 col-md-6 col-lg-4" key={producto.id}>
              <article className="card h-100">
                <div className="card-body">
                  <h3 className="h5 card-title">
                    {producto.nombre}
                  </h3>

                  <p className="card-text">
                    {producto.tipo === 'pasteleria'
                      ? 'Pastelería'
                      : producto.tipo === 'expreso'
                        ? 'Expreso'
                        : 'Filtrado'}
                  </p>

                  <p className="fw-bold mb-0">
                    ${producto.precio.toLocaleString('es-AR')}
                  </p>
                </div>
              </article>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (estado.estado === 'error') {
    return (
      <section aria-label="Menú">
        <div className="alert alert-danger" role="alert">
          <p className="fw-semibold mb-2">
            No pudimos cargar el menú
          </p>

          <p className="mb-3">
            Ocurrió un problema al obtener los productos. Intentá nuevamente.
          </p>

          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={reintentar}
          >
            Reintentar
          </button>
        </div>
      </section>
    );
  }

  return null;
}
