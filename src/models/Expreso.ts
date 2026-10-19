import { Producto } from './Producto.js';
import { CONFIG_CAFE, VariedadCafe, TamanioCafe } from '../data/preciosData.js';

export class Expreso extends Producto {
  variedad: VariedadCafe;
  tamanio: TamanioCafe;

  constructor(id: number, variedad: VariedadCafe, tamanio: TamanioCafe) {
    super(id, `Expreso ${variedad} (${tamanio})`, CONFIG_CAFE.precioBaseExpreso);
    this.variedad = variedad;
    this.tamanio = tamanio;
  }

  calcularPrecio(): number {
    const gramos = CONFIG_CAFE.gramosExpreso[this.tamanio];
    const precioPorGramo = CONFIG_CAFE.variedades[this.variedad];

    if (!gramos || !precioPorGramo) {
      throw new Error('Variedad o tamaño de expreso inválido');
    }

    const costoCafe = gramos * precioPorGramo;
    return this.precioBase + costoCafe;
  }
}