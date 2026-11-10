import type { Producto } from '../api/schemas';

export const productosEjemplo: Producto[] = [
  { id: 1, tipo: 'expreso', nombre: 'Expreso Pocillo', tamanio: 'Pocillo', precio: 5200,
    variedad: { nombre: 'Colombia', descripcion: 'Acidez media, cuerpo equilibrado y notas cítricas y florales' } },
  { id: 5, tipo: 'expreso', nombre: 'Expreso Mediano', tamanio: 'Mediano', precio: 7360,
    variedad: { nombre: 'Colombia', descripcion: 'Acidez media, cuerpo equilibrado y notas cítricas y florales' } },
  { id: 6, tipo: 'expreso', nombre: 'Expreso Mediano', tamanio: 'Mediano', precio: 6900,
    variedad: { nombre: 'Brasil', descripcion: 'Acidez baja, cuerpo alto y notas a chocolate y nueces' } },
  { id: 7, tipo: 'expreso', nombre: 'Expreso Mediano', tamanio: 'Mediano', precio: 8100,
    variedad: { nombre: 'Etiopía', descripcion: 'Acidez alta, cuerpo ligero y notas frutales y florales' } },
  { id: 10, tipo: 'filtrado', nombre: 'Filtrado Mediano', tamanio: 'Mediano', precio: 6800,
    variedad: { nombre: 'Colombia', descripcion: 'Acidez media, cuerpo equilibrado y notas cítricas y florales' } },
  { id: 19, tipo: 'pasteleria', nombre: 'Muffin de chocolate', precio: 3500 },
];