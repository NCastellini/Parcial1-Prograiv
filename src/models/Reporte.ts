export interface CantidadesVendidas {
  [nombreProducto: string]: number;
}

export interface ProductoMasVendidoResultado {
  productos: string[];
  cantidad: number;
}

export interface ReporteGeneral {
  facturacionTotal: number;
  cantidadesVendidas: CantidadesVendidas;
  productoMasVendido: ProductoMasVendidoResultado;
}