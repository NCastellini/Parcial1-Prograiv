import { Producto } from './Producto.js';
import { CONFIG_CAFE, VariedadCafe, TamanioCafe } from '../data/preciosData.js';

export class Filtrado extends Producto {
  variedad: VariedadCafe;
  tamanio: TamanioCafe;

  constructor(id: number, variedad: VariedadCafe, tamanio: TamanioCafe) {
    super(id, `Café Filtrado ${variedad} (${tamanio})`, CONFIG_CAFE.precioBaseFiltrado);
    this.variedad = variedad;
    this.tamanio = tamanio;
  }

  calcularPrecio(): number {
    const gramos = CONFIG_CAFE.gramosFiltrado[this.tamanio];
    const precioPorGramo = CONFIG_CAFE.variedades[this.variedad];

    if (!gramos || !precioPorGramo) {
      throw new Error('Variedad o tamaño de filtrado inválido');
    }

    const costoCafe = gramos * precioPorGramo;
    return this.precioBase + costoCafe;
  }
}