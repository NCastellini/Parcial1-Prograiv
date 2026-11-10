import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { Producto } from '../api/schemas';
import { carritoReducer, type ItemCarrito } from './carritoReducer';

type CarritoContexto = {
  items: ItemCarrito[];
  agregar: (producto: Producto) => void;
  sumar: (id: number) => void;
  restar: (id: number) => void;
  quitar: (id: number) => void;
  vaciar: () => void;
};

const Contexto = createContext<CarritoContexto | null>(null);

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(carritoReducer, []);

  const valor: CarritoContexto = {
    items,
    agregar: (producto) => dispatch({
      type: 'AGREGAR',
      payload: { id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 },
    }),
    sumar: (id) => {
      const item = items.find((actual) => actual.id === id);
      if (item) dispatch({ type: 'AGREGAR', payload: { ...item, cantidad: 1 } });
    },
    restar: (id) => dispatch({ type: 'RESTAR', payload: { id } }),
    quitar: (id) => dispatch({ type: 'QUITAR', payload: { id } }),
    vaciar: () => dispatch({ type: 'VACIAR' }),
  };

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useCarrito(): CarritoContexto {
  const contexto = useContext(Contexto);
  if (!contexto) throw new Error('useCarrito requiere CarritoProvider');
  return contexto;
}
