import { describe, it, expect } from 'vitest'
import { carritoReducer, type ItemCarrito, type ActionCarrito } from './carritoReducer'

describe('carritoReducer', () => {
  it('agrega un producto nuevo al carrito', () => {
    const estadoInicial: ItemCarrito[] = []
    const producto: ItemCarrito = { id: 1, nombre: 'Cafe', precio: 1000, cantidad: 1 }
    const accion: ActionCarrito = { type: 'AGREGAR', payload: producto }

    const estadoFinal = carritoReducer(estadoInicial, accion)

    expect(estadoFinal).toHaveLength(1)
    expect(estadoFinal[0]).toEqual(producto)
  })

  it('incrementa la cantidad si el producto ya existe al agregar', () => {
    const estadoInicial: ItemCarrito[] = [{ id: 1, nombre: 'Cafe', precio: 1000, cantidad: 1 }]
    const producto: ItemCarrito = { id: 1, nombre: 'Cafe', precio: 1000, cantidad: 1 }
    const accion: ActionCarrito = { type: 'AGREGAR', payload: producto }

    const estadoFinal = carritoReducer(estadoInicial, accion)

    expect(estadoFinal).toHaveLength(1)
    expect(estadoFinal[0].cantidad).toBe(2)
  })

  it('resta la cantidad de un producto', () => {
    const estadoInicial: ItemCarrito[] = [{ id: 1, nombre: 'Cafe', precio: 1000, cantidad: 2 }]
    const accion: ActionCarrito = { type: 'RESTAR', payload: { id: 1 } }

    const estadoFinal = carritoReducer(estadoInicial, accion)

    expect(estadoFinal[0].cantidad).toBe(1)
  })

  it('elimina el producto si la cantidad llega a cero al restar', () => {
    const estadoInicial: ItemCarrito[] = [{ id: 1, nombre: 'Cafe', precio: 1000, cantidad: 1 }]
    const accion: ActionCarrito = { type: 'RESTAR', payload: { id: 1 } }

    const estadoFinal = carritoReducer(estadoInicial, accion)

    expect(estadoFinal).toHaveLength(0)
  })

  it('quita un producto completamente del carrito', () => {
    const estadoInicial: ItemCarrito[] = [{ id: 1, nombre: 'Cafe', precio: 1000, cantidad: 2 }]
    const accion: ActionCarrito = { type: 'QUITAR', payload: { id: 1 } }

    const estadoFinal = carritoReducer(estadoInicial, accion)

    expect(estadoFinal).toHaveLength(0)
  })

  it('vacía todo el carrito', () => {
    const estadoInicial: ItemCarrito[] = [
      { id: 1, nombre: 'Cafe', precio: 1000, cantidad: 1 },
      { id: 2, nombre: 'Medialuna', precio: 500, cantidad: 2 },
    ]
    const accion: ActionCarrito = { type: 'VACIAR' }

    const estadoFinal = carritoReducer(estadoInicial, accion)

    expect(estadoFinal).toHaveLength(0)
  })
})