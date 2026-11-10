import { useCarrito } from '../context/CarritoContext';

export default function Carrito({ onConfirmar }: { onConfirmar?: () => void }) {
  const { items, sumar, restar, quitar, vaciar } = useCarrito();
  const total = items.reduce((acumulado, item) => acumulado + item.precio * item.cantidad, 0);
  const moneda = (importe: number) => `$${importe.toLocaleString('es-AR')}`;

  return <section aria-label="Carrito" className="mt-4">
    <h2 className="h4">Tu pedido</h2>
    {items.length === 0 ? <p>Tu pedido está vacío</p> : <>
      <ul className="list-group mb-3">
        {items.map((item) => <li className="list-group-item" key={item.id}>
          <h3 className="h6">{item.nombre}</h3>
          <p className="mb-1">Unitario: {moneda(item.precio)}</p>
          <p className="mb-1">Cantidad: {item.cantidad}</p>
          <p className="mb-2">Subtotal: {moneda(item.precio * item.cantidad)}</p>
          <div className="d-flex flex-wrap gap-2">
            <button className="btn btn-outline-secondary btn-sm" type="button"
              aria-label={`Sumar ${item.nombre}`} onClick={() => sumar(item.id)}>+</button>
            <button className="btn btn-outline-secondary btn-sm" type="button"
              aria-label={`Restar ${item.nombre}`} onClick={() => restar(item.id)}>−</button>
            <button className="btn btn-outline-danger btn-sm" type="button"
              aria-label={`Quitar ${item.nombre}`} onClick={() => quitar(item.id)}>Quitar</button>
          </div>
        </li>)}
      </ul>
    </>}
    <p className="fw-bold">Total: {moneda(total)}</p>
    <div className="d-flex flex-wrap gap-2">
      <button className="btn btn-outline-secondary" type="button" disabled={items.length === 0}
        onClick={vaciar}>Vaciar carrito</button>
      <button className="btn btn-primary" type="button" disabled={items.length === 0 || !onConfirmar}
        onClick={onConfirmar}>Confirmar</button>
    </div>
  </section>;
}
