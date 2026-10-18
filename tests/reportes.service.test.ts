import { describe, test, expect } from 'vitest';
import { ReportesService } from '../src/services/reportes.service';

describe('ReportesService - Tests Unitarios', () => {

  const pedidosMock = [
    {
      id: 1,
      total: 1200,
      items: [
        { producto: { nombre: 'Expreso' }, cantidad: 2 },
        { producto: { nombre: 'Medialuna' }, cantidad: 1 }
      ]
    },
    {
      id: 2,
      total: 800,
      items: [
        { producto: { nombre: 'Expreso' }, cantidad: 1 }
      ]
    }
  ];

  test('Debe calcular correctamente la suma total de los pedidos', () => {
    const total = ReportesService.calcularFacturacionTotal(pedidosMock);
    expect(total).toBe(2000);
  });

  test('Debe retornar 0 si no hay pedidos en facturación', () => {
    expect(ReportesService.calcularFacturacionTotal([])).toBe(0);
  });

  test('Debe sumar adecuadamente las cantidades vendidas por cada producto', () => {
    const ventas = ReportesService.calcularCantidadesVendidas(pedidosMock);
    expect(ventas).toEqual({
      'Expreso': 3,
      'Medialuna': 1
    });
  });

  test('Debe retornar un objeto vacío si no hay pedidos para cantidades', () => {
    expect(ReportesService.calcularCantidadesVendidas([])).toEqual({});
  });

  test('Debe identificar el producto más vendido', () => {
    const resultado = ReportesService.obtenerProductoMasVendido(pedidosMock);
    expect(resultado).toEqual({
      productos: ['Expreso'],
      cantidad: 3
    });
  });

  test('Debe resolver adecuadamente el caso de empate', () => {
    const pedidosEmpate = [
      { id: 1, total: 500, items: [{ producto: { nombre: 'Expreso' }, cantidad: 2 }] },
      { id: 2, total: 500, items: [{ producto: { nombre: 'Filtrado' }, cantidad: 2 }] }
    ];

    const resultado = ReportesService.obtenerProductoMasVendido(pedidosEmpate);
    expect(resultado.cantidad).toBe(2);
    expect(resultado.productos).toContain('Expreso');
    expect(resultado.productos).toContain('Filtrado');
    expect(resultado.productos.length).toBe(2);
  });

  test('Debe responder correctamente cuando la lista de pedidos está vacía en más vendido', () => {
    const resultado = ReportesService.obtenerProductoMasVendido([]);
    expect(resultado).toEqual({
      productos: [],
      cantidad: 0
    });
  });

});