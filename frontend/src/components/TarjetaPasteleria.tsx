import type { Producto } from '../api/schemas';

export type ProductoPasteleria = Extract<Producto, { tipo: 'pasteleria' }>;

export type PropsTarjetaPasteleria = {
  producto: ProductoPasteleria
  onAgregar: (producto: ProductoPasteleria) => void
}

export function TarjetaPasteleria({ producto, onAgregar }: PropsTarjetaPasteleria) {
  return <article className="card h-100">
    <div className="card-body">
      <h3 className="h5 card-title">{producto.nombre}</h3>
      <p className="fw-bold">${producto.precio.toLocaleString('es-AR')}</p>
      <button className="btn btn-primary" type="button" onClick={() => onAgregar(producto)}>
        Agregar al carrito
      </button>
    </div>
  </article>;
}
