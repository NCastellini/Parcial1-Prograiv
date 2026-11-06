import type { Producto } from '../api/schemas';

export type ProductoCafe = Extract<Producto, { tipo: 'expreso' | 'filtrado' }>;
export type TipoBebida = ProductoCafe['tipo'];

export type EleccionCafe = {
  tipo: TipoBebida;
  tamanio: string;
  origen: string;
};

export function esCafe(producto: Producto): producto is ProductoCafe {
  return producto.tipo !== 'pasteleria';
}

export function buscarCafe(
  eleccion: EleccionCafe,
  productos: Producto[],
): ProductoCafe | undefined {
  return productos
    .filter(esCafe)
    .find((p) => p.tipo === eleccion.tipo && p.tamanio === eleccion.tamanio);
}