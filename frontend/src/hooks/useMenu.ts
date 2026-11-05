import { useState } from 'react';
import type { Producto } from '../api/schemas';

export type EstadoMenu =
  | { estado: 'cargando' }
  | { estado: 'error'; mensaje: string }
  | { estado: 'listo'; productos: Producto[] };

export function useMenu() {
  const [estado] = useState<EstadoMenu>({
    estado: 'cargando',
  });

  return { estado };
}
