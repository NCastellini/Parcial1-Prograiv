import { productos } from '../data/productosCafe.js';
import type { Producto } from '../models/Producto.ts';

export function listarProductos(): Producto[] {
  return productos;
}

export function obtenerProducto(id: number): Producto | undefined {
  return productos.find((p) => p.id === id);
}