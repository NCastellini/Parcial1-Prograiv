import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
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
})