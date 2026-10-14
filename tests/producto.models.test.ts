// tests/producto.test.ts
import { describe, test, expect } from 'vitest';
import { Expreso } from '../src/models/Expreso.js';
import { Filtrado } from '../src/models/Filtrado.js';
import { Pasteleria } from '../src/models/Pasteleria.js';

describe('Módulo de Productos y Precios - Integrante 1', () => {

  test('Expreso Pocillo Brasil debe valer 5020', () => {
    const expreso = new Expreso(1, 'Brasil', 'Pocillo');
    expect(expreso.calcularPrecio()).toBe(5020);
  });

  test('Expreso Taza grande Etiopía debe valer 11140', () => {
    const expreso = new Expreso(2, 'Etiopía', 'Taza grande');
    expect(expreso.calcularPrecio()).toBe(11140);
  });

  test('Filtrado Mediano Colombia debe valer 5900', () => {
    const filtrado = new Filtrado(3, 'Colombia', 'Mediano');
    expect(filtrado.calcularPrecio()).toBe(5900);
  });

  test('Filtrado Taza grande Etiopía debe valer 9200', () => {
    const filtrado = new Filtrado(4, 'Etiopía', 'Taza grande');
    expect(filtrado.calcularPrecio()).toBe(9200);
  });

  test('Pastelería debe retornar su precio base', () => {
    const muffin = new Pasteleria(5, 'Muffins de chocolate');
    const torta = new Pasteleria(6, 'Torta selva negra');

    expect(muffin.calcularPrecio()).toBe(2500);
    expect(torta.calcularPrecio()).toBe(4200);
  });

});