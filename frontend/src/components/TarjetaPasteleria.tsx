import React from 'react'

export type ProductoPasteleria = {
  id: number
  nombre: string
  precio: number
  tipo: 'pasteleria'
}

export type PropsTarjetaPasteleria = {
  producto: ProductoPasteleria
  onAgregar: (producto: ProductoPasteleria) => void
}

export function TarjetaPasteleria({ producto, onAgregar }: PropsTarjetaPasteleria) {
  return React.createElement(
    'article',
    null,
    React.createElement('h3', null, producto.nombre),
    React.createElement(
      'button',
      { onClick: () => onAgregar(producto) },
      'Agregar al carrito'
    )
  )
}