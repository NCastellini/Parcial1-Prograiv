import { describe, expect, it } from 'vitest';
import { buscarCafe } from './buscarCafe';
import { productosEjemplo } from '../test/productosEjemplo';

describe('buscarCafe', () => {
  it('devuelve el producto que coincide con la elección', () => {
    const resultado = buscarCafe(
      { tipo: 'expreso', tamanio: 'Mediano', origen: 'Colombia' },
      productosEjemplo,
    );

    expect(resultado?.id).toBe(5);
  });
});