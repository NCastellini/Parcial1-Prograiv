import { CantidadesVendidas, ProductoMasVendidoResultado, ReporteGeneral } from '../models/Reporte.js';
// O si tu proyecto no usa extensión .js en imports, déjalo como '../models/Reporte' según el resto de los archivos de tus compañeros.

export class ReportesService {

  /**
   * 1. Calcular la facturación total sumando los totales de todos los pedidos
   */
  public static calcularFacturacionTotal(pedidos: any[]): number {
    if (!pedidos || pedidos.length === 0) return 0;
    return pedidos.reduce((acc: number, pedido: any) => acc + (Number(pedido.total) || 0), 0);
  }

  /**
   * 2. Calcular las cantidades vendidas por producto
   */
  public static calcularCantidadesVendidas(pedidos: any[]): CantidadesVendidas {
    const ventas: CantidadesVendidas = {};

    if (!pedidos || pedidos.length === 0) return ventas;

    for (const pedido of pedidos) {
      if (Array.isArray(pedido.items)) {
        for (const item of pedido.items) {
          const nombre = item.producto?.nombre || item.nombre || item.productoId || 'Desconocido';
          const cantidad = Number(item.cantidad) || 0;

          ventas[nombre] = (ventas[nombre] || 0) + cantidad;
        }
      }
    }

    return ventas;
  }

  /**
   * 3. Determinar el producto más vendido (Maneja casos sin pedidos y empates)
   */
  public static obtenerProductoMasVendido(pedidos: any[]): ProductoMasVendidoResultado {
    const ventas = this.calcularCantidadesVendidas(pedidos);
    const nombresProductos = Object.keys(ventas);

    if (nombresProductos.length === 0) {
      return { productos: [], cantidad: 0 };
    }

    let maxCantidad = 0;
    let masVendidos: string[] = [];

    for (const [producto, cantidad] of Object.entries(ventas)) {
      if (cantidad > maxCantidad) {
        maxCantidad = cantidad;
        masVendidos = [producto];
      } else if (cantidad === maxCantidad && cantidad > 0) {
        masVendidos.push(producto);
      }
    }

    return {
      productos: masVendidos,
      cantidad: maxCantidad
    };
  }

  /**
   * Obtener reporte completo consolidado
   */
  public static generarReporteCompleto(pedidos: any[]): ReporteGeneral {
    return {
      facturacionTotal: this.calcularFacturacionTotal(pedidos),
      cantidadesVendidas: this.calcularCantidadesVendidas(pedidos),
      productoMasVendido: this.obtenerProductoMasVendido(pedidos)
    };
  }
}