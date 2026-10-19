import { Expreso } from '../models/Expreso.js';
import { Filtrado } from '../models/Filtrado.js';
import { Pasteleria } from '../models/Pasteleria.js';
import { Producto } from '../models/Producto.js';

// lista de productos disponibles en la cafetería
export const productos: Producto[] = [
  new Expreso(1, 'Brasil', 'Pocillo'),
  new Expreso(2, 'Colombia', 'Mediano'),
  new Expreso(3, 'Etiopía', 'Taza grande'),
  new Filtrado(4, 'Brasil', 'Pocillo'),
  new Filtrado(5, 'Colombia', 'Mediano'),
  new Filtrado(6, 'Etiopía', 'Taza grande'),
  new Pasteleria(7, 'Muffins de chocolate'),
  new Pasteleria(8, 'Torta selva negra'),
];
