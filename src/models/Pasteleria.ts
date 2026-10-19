// src/models/Pasteleria.ts
import { Producto } from './Producto.js';
import { PASTELERIA_PRECIOS, NombrePasteleria } from '../data/preciosData.js';

export class Pasteleria extends Producto {
  constructor(id: number, nombreItem: NombrePasteleria) {
    const precio = PASTELERIA_PRECIOS[nombreItem];
    if (precio === undefined) {
      throw new Error('Item de pastelería inexistente');
    }
    super(id, nombreItem, precio);
  }

  calcularPrecio(): number {
    return this.precioBase;
  }
}