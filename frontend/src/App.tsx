import { useState } from 'react';
import Header from './components/Header';
import Menu from './components/Menu';
import { leerMesaDesdeUrl } from './utils/leerMesaDesdeUrl';
import SelectorCafe from './components/SelectorCafe';
import SeccionPasteleria from './components/SeccionPasteleria';
import Carrito from './components/Carrito';
import { CarritoProvider, useCarrito } from './context/CarritoContext';
import ConfirmarPedido from './components/ConfirmarPedido';
import SeguimientoPedido from './components/SeguimientoPedido';

function Contenido() {
  const mesa = leerMesaDesdeUrl(window.location.href);
  const { agregar, items, vaciar } = useCarrito();
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [intentoConfirmacion, setIntentoConfirmacion] = useState(0);
  const [pedidoConfirmado, setPedidoConfirmado] = useState<number | null>(null);

  return (
    <>
      <Header mesa={mesa} />

      <main className="container py-4">
        <h2>Menú de Cafetería Origen</h2>
        <p>Seleccioná tus productos para hacer un pedido.</p>
        
        <Menu mostrarCatalogo={false}>{(productos) => <>
          <SelectorCafe productos={productos} onAgregar={agregar} />
          <SeccionPasteleria productos={productos} onAgregar={agregar} />
        </>}</Menu>
        <Carrito onConfirmar={() => {
          setMostrarConfirmacion(true);
          setIntentoConfirmacion((intento) => intento + 1);
          setPedidoConfirmado(null);
        }} />
        {mostrarConfirmacion && <ConfirmarPedido
          key={intentoConfirmacion}
          items={items}
          mesa={mesa}
          onConfirmado={(pedido) => {
            vaciar();
            setPedidoConfirmado(pedido.id);
          }}
        />}
        {pedidoConfirmado !== null && <SeguimientoPedido pedidoId={pedidoConfirmado} />}
      </main>
    </>
  );
}

export default function App() {
  return <CarritoProvider><Contenido /></CarritoProvider>;
}
