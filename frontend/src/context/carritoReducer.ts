export type ItemCarrito = {
  id: number
  nombre: string
  precio: number
  cantidad: number
}

export type ActionCarrito =
  | { type: 'AGREGAR'; payload: ItemCarrito }
  | { type: 'RESTAR'; payload: { id: number } }
  | { type: 'QUITAR'; payload: { id: number } }
  | { type: 'VACIAR' }

export function carritoReducer(state: ItemCarrito[], action: ActionCarrito): ItemCarrito[] {
  switch (action.type) {
    case 'AGREGAR': {
      const existe = state.find(item => item.id === action.payload.id)
      if (existe) {
        return state.map(item =>
          item.id === action.payload.id
            ? { ...item, cantidad: item.cantidad + (action.payload.cantidad || 1) }
            : item
        )
      }
      return [...state, { ...action.payload, cantidad: action.payload.cantidad || 1 }]
    }
    case 'RESTAR': {
      return state
        .map(item =>
          item.id === action.payload.id
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
        .filter(item => item.cantidad > 0)
    }
    case 'QUITAR': {
      return state.filter(item => item.id !== action.payload.id)
    }
    case 'VACIAR': {
      return []
    }
    default:
      return state
  }
}