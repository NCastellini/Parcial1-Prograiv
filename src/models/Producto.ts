export abstract class Producto {
  id: number;
  nombre: string;
  precioBase: number;

  constructor(id: number, nombre: string, precioBase: number) {
    this.id = id;
    this.nombre = nombre;
    this.precioBase = precioBase;
  }

  abstract calcularPrecio(): number;
}
