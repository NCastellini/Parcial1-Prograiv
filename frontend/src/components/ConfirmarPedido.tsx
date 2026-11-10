// Item del carrito tal como lo produce el reducer (feature/carrito).
export type ItemCarrito = {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
};

type Props = {
  items: ItemCarrito[];
  mesa: number | null;
};

export default function ConfirmarPedido(_props: Props) {
  return (
    <button type="button" className="btn btn-success">
      Confirmar pedido
    </button>
  );
}
