import type { Pedido, ItemPedido } from '../data/pedidosCafe.js';
import { obtenerProducto } from './productos.service.js';

// Modelo reducido de los productos para agregarlos a los pedidos.
export interface ItemEntrada {
    productoId: number;
    cantidad: number;
}

// Un arreglo de pedidos que contienen la id del pedido, los productos, el estado y el precio total.
export const pedidos: Pedido[] = [];
// Variable incremental para el id de los pedidos.
let siguienteId = 1;

export function calcularTotal(items: ItemPedido[]): number {
    return items.reduce((acc, i) => acc + i.precioUnitario * i.cantidad, 0);
}

export function crearPedido(entrada: ItemEntrada[]): Pedido {
    if (!Array.isArray(entrada) || entrada.length === 0) {
        throw new Error('El pedido debe tener al menos un item'); // Caso de error: El pedido está vacío.
    }

    const items: ItemPedido[] = entrada.map(({ productoId, cantidad }) => {
        if (!Number.isInteger(cantidad) || cantidad <= 0) {
            throw new Error(`Cantidad inválida para el producto ${productoId}`); // Caso de error: Se selecciona una cantidad inválida del producto.
        }
        const producto = obtenerProducto(productoId);
        if (!producto) {
            throw new Error(`El producto ${productoId} no existe`); // Caso de error: Se selecciona un item con id inválido.
        }
        return { productoId, cantidad, precioUnitario: producto.calcularPrecio() };
    });

    const pedido: Pedido = {
        id: siguienteId++,
        items,
        estado: 'pendiente',
        total: calcularTotal(items),
    };
    pedidos.push(pedido);
    return pedido;
}

export function listarPedidos(): Pedido[] {
    return pedidos;
}

export function obtenerPedido(id: number): Pedido {
    const pedido = pedidos.find((p) => p.id === id);
    if (!pedido) throw new Error(`Pedido ${id} no encontrado`); // Caso de error: El pedido que se busca no existe.
    return pedido;
}

// Función para reiniciar los pedidos (Útil para los tests).
export function reiniciarPedidos(): void {
    pedidos.length = 0;
    siguienteId = 1;
}