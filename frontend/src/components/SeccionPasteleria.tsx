import type { Producto } from '../api/schemas';
import { TarjetaPasteleria } from './TarjetaPasteleria';

type Props = { productos: Producto[]; onAgregar: (producto: Producto) => void };

export default function SeccionPasteleria({ productos, onAgregar }: Props) {
  const pasteleria = productos.filter((producto) => producto.tipo === 'pasteleria');
  return <section aria-label="Pastelería" className="mt-4">
    <h2 className="h4">Pastelería</h2>
    <div className="row g-3">
      {pasteleria.map((producto) => <div className="col-12 col-sm-6 col-lg-4" key={producto.id}>
        <TarjetaPasteleria producto={producto} onAgregar={onAgregar} />
      </div>)}
    </div>
  </section>;
}
