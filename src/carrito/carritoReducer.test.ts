import { describe, it, expect } from 'vitest'
import { carritoReducer, estadoInicial } from './carritoReducer.js'

const muffin = {
  id: 1,
  nombre: 'Muffin de chocolate',
  precio: 2500,
  tipo: 'pasteleria' as const,
}

describe('carritoReducer', () => {
  it('AGREGAR suma un producto nuevo al carrito', () => {
    const resultado = carritoReducer(estadoInicial, {
      type: 'AGREGAR',
      producto: muffin,
    })

    expect(resultado.items).toEqual([{ producto: muffin, cantidad: 1 }])
  })
})


it('AGREGAR incrementa cantidad si el producto ya está', () => {
  const estadoInicialConItem = {
    items: [{ producto: muffin, cantidad: 1 }]
  }

  const resultado = carritoReducer(estadoInicialConItem, {
    type: 'AGREGAR',
    producto: muffin,
  })

  expect(resultado.items).toEqual([{ producto: muffin, cantidad: 2 }])
})

it('RESTAR decrementa la cantidad del producto', () => {
    const estadoInicialConItem = {
      items: [{ producto: muffin, cantidad: 2 }]
    }

    const resultado = carritoReducer(estadoInicialConItem, {
      type: 'RESTAR',
      productoId: muffin.id,
    })

    expect(resultado.items).toEqual([{ producto: muffin, cantidad: 1 }])
  })