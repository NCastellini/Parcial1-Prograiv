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
          } catch (error: unknown) {
            if (activo) {
              setEstado({
                estado: 'error',
                mensaje:
                  error instanceof Error
                    ? error.message
                    : 'No se pudo cargar el menú',
              });
            }
          }
    }

    void cargarProductos();

    return () => {
      activo = false;
    };
  }, []);

  return { estado };
}
