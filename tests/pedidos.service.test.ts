import { describe, it, expect, beforeEach } from 'vitest';
import { crearPedido, obtenerPedido, calcularTotal, reiniciarPedidos,} from '../src/services/pedidos.service.js';

beforeEach(() => reiniciarPedidos());

describe('CalcularTotal: calcula el total del pedido que en este caso debería ser $17,540', () => {
    it('Suma precioUnitario × cantidad', () => {
        const total = calcularTotal([
        { productoId: 1, cantidad: 2, precioUnitario: 5020 },
        { productoId: 19, cantidad: 3, precioUnitario: 2500 },
        ]);
        expect(total).toBe(17540);
    });
});

describe('CrearPedido: Crea pedidos y prueba distintos casos de éxito y de error', () => {
    it('Crea el pedido en estado pendiente con id incremental', () => {
        const a = crearPedido([{ productoId: 1, cantidad: 1 }]);
        const b = crearPedido([{ productoId: 1, cantidad: 1 }]);
        expect(a.estado).toBe('pendiente');
        expect(b.id).toBe(a.id + 1);
    });

    it('Guarda el precio unitario como snapshot', () => {
        const p = crearPedido([{ productoId: 1, cantidad: 2 }]);
        expect(p.items[0].precioUnitario).toBeGreaterThan(0);
        expect(p.total).toBe(p.items[0].precioUnitario * 2);
    });

    it.each([
        ['Lista vacía', []],
        ['Cantidad cero', [{ productoId: 1, cantidad: 0 }]],
        ['Cantidad negativa', [{ productoId: 1, cantidad: -1 }]],
        ['Cantidad decimal', [{ productoId: 1, cantidad: 1.5 }]],
        ['Producto inexistente', [{ productoId: 999, cantidad: 1 }]],
    ])('Rechaza: %s', (_caso, entrada) => {
        expect(() => crearPedido(entrada)).toThrow(Error);
    });
});

describe('obtenerPedido', () => {
    it('Lanza error si no existe el pedido', () => {
        expect(() => obtenerPedido(123)).toThrow(Error);
    });
});