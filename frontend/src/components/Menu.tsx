import { useMenu } from '../hooks/useMenu';

export default function Menu() {
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
            <p className="mb-3">{estado.mensaje}</p>

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
