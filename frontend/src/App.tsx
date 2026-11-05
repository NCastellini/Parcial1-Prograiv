import Header from './components/Header';
import Menu from './components/Menu';
import { leerMesaDesdeUrl } from './utils/leerMesaDesdeUrl';

export default function App() {
  const mesa = leerMesaDesdeUrl(window.location.href);

  return (
    <>
      <Header mesa={mesa} />

      <main className="container py-4">
        <h2>Menú de Cafetería Origen</h2>
        <p>Seleccioná tus productos para hacer un pedido.</p>
        
        <Menu />
      </main>
    </>
  );
}
