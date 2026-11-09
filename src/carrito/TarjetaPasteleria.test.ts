import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { TarjetaPasteleria } from './TarjetaPasteleria.js'

const muffin = {
  id: 1,
  nombre: 'Muffin de chocolate',
  precio: 2500,
  tipo: 'pasteleria' as const,
}

describe('TarjetaPasteleria', () => {
  it('TarjetaPasteleria renderiza el nombre del producto', () => {
    const { getByText } = render(
      TarjetaPasteleria({ producto: muffin, onAgregar: () => {} })
    )

    expect(getByText('Muffin de chocolate')).toBeDefined()
  })

  it('llama a onAgregar con el producto al hacer clic en el boton', () => {
    const onAgregarMock = vi.fn()
    const { getByRole } = render(
      TarjetaPasteleria({ producto: muffin, onAgregar: onAgregarMock })
    )

    const boton = getByRole('button', { name: /agregar/i })
    fireEvent.click(boton)

    expect(onAgregarMock).toHaveBeenCalledWith(muffin)
  })
})