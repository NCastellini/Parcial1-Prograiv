import { useEffect, useState } from 'react';
import { api } from '../api/client';
import type { Producto } from '../api/schemas';

export type EstadoMenu =
  | { estado: 'cargando' }
  | { estado: 'error'; mensaje: string }
  | { estado: 'listo'; productos: Producto[] };

export function useMenu() {
  const [estado, setEstado] = useState<EstadoMenu>({
    estado: 'cargando',
  });

  useEffect(() => {
    let activo = true;

    async function cargarProductos() {
      try {
        const productos = await api.obtenerProductos();

        if (activo) {
          setEstado({
            estado: 'listo',
            productos,
          });
        }
      } catch {
        //el manejo de errores lo implemento en el siguiente ciclo TDD
      }
    }

    void cargarProductos();

    return () => {
      activo = false;
    };
  }, []);

  return { estado };
}
