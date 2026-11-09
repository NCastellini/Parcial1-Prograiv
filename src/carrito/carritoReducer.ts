export type ProductoCarrito = {
  id: number
  nombre: string
  precio: number
  tipo: 'expreso' | 'filtrado' | 'pasteleria'
}

export type ItemCarrito = { producto: ProductoCarrito; cantidad: number }

export type EstadoCarrito = { items: ItemCarrito[] }

export type AccionCarrito =
  | { type: 'AGREGAR'; producto: ProductoCarrito }
  | { type: 'RESTAR'; productoId: number }
  | { type: 'QUITAR'; productoId: number }
  | { type: 'VACIAR' }

export const estadoInicial: EstadoCarrito = { items: [] }

export function carritoReducer(
  estado: EstadoCarrito,
  accion: AccionCarrito,
): EstadoCarrito {
  switch (accion.type) {
    case 'AGREGAR': {
      const yaEsta = estado.items.some(
        (item) => item.producto.id === accion.producto.id,
      )

      if (!yaEsta) {
        return {
          items: [...estado.items, { producto: accion.producto, cantidad: 1 }],
        }
      }

      return {
        items: estado.items.map((item) =>
          item.producto.id === accion.producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        ),
      }
    }
    case 'RESTAR': {
      const index = estado.items.findIndex(
        (item) => item.producto.id === accion.productoId
      )

      if (index >= 0) {
        const nuevosItems = [...estado.items]
        if (nuevosItems[index].cantidad > 1) {
          nuevosItems[index] = {
            ...nuevosItems[index],
            cantidad: nuevosItems[index].cantidad - 1,
          }
          return { items: nuevosItems }
        } else {
          nuevosItems.splice(index, 1)
          return { items: nuevosItems }
        }
      }
      return estado
    }
    case 'QUITAR': {
      const nuevosItems = estado.items.filter(
        (item) => item.producto.id !== accion.productoId
      )
      return { items: nuevosItems }
    }
    case 'VACIAR': {
      return { items: [] }
    }
    default:
      return estado
  }
}