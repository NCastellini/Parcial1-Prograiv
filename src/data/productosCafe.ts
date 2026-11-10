import { Expreso } from '../models/Expreso.js';
import { Filtrado } from '../models/Filtrado.js';
import { Pasteleria } from '../models/Pasteleria.js';
import type { Producto } from '../models/Producto.js';

// Crea una lista nueva para que seed pueda restaurar el catálogo inicial.
export function crearProductosDePrueba(): Producto[] {
  return [
    new Expreso(1, 'Brasil', 'Pocillo'),
    new Expreso(2, 'Colombia', 'Mediano'),
    new Expreso(3, 'Etiopía', 'Taza grande'),
    new Filtrado(4, 'Brasil', 'Pocillo'),
    new Filtrado(5, 'Colombia', 'Mediano'),
    new Filtrado(6, 'Etiopía', 'Taza grande'),
    new Pasteleria(7, 'Muffins de chocolate'),
    new Pasteleria(8, 'Torta selva negra'),
    new Expreso(9, 'Brasil', 'Mediano'),
    new Expreso(10, 'Brasil', 'Taza grande'),
    new Expreso(11, 'Colombia', 'Pocillo'),
    new Expreso(12, 'Colombia', 'Taza grande'),
    new Expreso(13, 'Etiopía', 'Pocillo'),
    new Expreso(14, 'Etiopía', 'Mediano'),
    new Filtrado(15, 'Brasil', 'Mediano'),
    new Filtrado(16, 'Brasil', 'Taza grande'),
    new Filtrado(17, 'Colombia', 'Pocillo'),
    new Filtrado(18, 'Colombia', 'Taza grande'),
    new Filtrado(19, 'Etiopía', 'Pocillo'),
    new Filtrado(20, 'Etiopía', 'Mediano'),
  ];
}

// La API y los pedidos comparten esta misma referencia.
export const productos: Producto[] = crearProductosDePrueba();
