export type ProductoCarrito = {
  id: number
  nombre: string
  precio: number
  tipo: 'expreso' | 'filtrado' | 'pasteleria'
}

export type ItemCarrito = { producto: ProductoCarrito; cantidad: number }

export type EstadoCarrito = { items: ItemCarrito[] }

export type AccionCarrito = { type: 'AGREGAR'; producto: ProductoCarrito }

export const estadoInicial: EstadoCarrito = { items: [] }

export function carritoReducer(
  estado: EstadoCarrito,
  accion: AccionCarrito,
): EstadoCarrito {
  switch (accion.type) {
    case 'AGREGAR':
      return { items: [...estado.items, { producto: accion.producto, cantidad: 1 }] }
  }
}