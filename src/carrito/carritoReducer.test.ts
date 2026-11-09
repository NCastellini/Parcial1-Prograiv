import { describe, it, expect } from 'vitest'
import { carritoReducer, estadoInicial } from './carritoReducer'

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