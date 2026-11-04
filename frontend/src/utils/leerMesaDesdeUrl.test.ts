import { describe, expect, it } from 'vitest';
import { leerMesaDesdeUrl } from './leerMesaDesdeUrl';

describe('leerMesaDesdeUrl', () => {
  it('devuelve el número de una mesa válida', () => {
    expect(leerMesaDesdeUrl('/?mesa=4')).toBe(4);
    expect(leerMesaDesdeUrl('/?mesa=12')).toBe(12);
  });

  it('devuelve null si no existe el parámetro', () => {
    expect(leerMesaDesdeUrl('/')).toBeNull();
  });

  it('devuelve null si el valor no es numérico', () => {
    expect(leerMesaDesdeUrl('/?mesa=abc')).toBeNull();
  });

  it('devuelve null para números no válidos', () => {
    expect(leerMesaDesdeUrl('/?mesa=0')).toBeNull();
    expect(leerMesaDesdeUrl('/?mesa=-3')).toBeNull();
    expect(leerMesaDesdeUrl('/?mesa=2.5')).toBeNull();
  });
});
