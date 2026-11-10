import { describe, expect, test } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

type ProductoApi = {
  id: number;
  nombre: string;
  tipo: 'expreso' | 'filtrado' | 'pasteleria';
  precio: number;
  tamanio?: string;
  variedad?: { nombre: string };
};

const combinaciones = [
  ['expreso', 'Brasil', 'Pocillo', 5020],
  ['expreso', 'Brasil', 'Mediano', 6280],
  ['expreso', 'Brasil', 'Taza grande', 7540],
  ['expreso', 'Colombia', 'Pocillo', 5740],
  ['expreso', 'Colombia', 'Mediano', 7360],
  ['expreso', 'Colombia', 'Taza grande', 8980],
  ['expreso', 'Etiopía', 'Pocillo', 6820],
  ['expreso', 'Etiopía', 'Mediano', 8980],
  ['expreso', 'Etiopía', 'Taza grande', 11140],
  ['filtrado', 'Brasil', 'Pocillo', 4040],
  ['filtrado', 'Brasil', 'Mediano', 5300],
  ['filtrado', 'Brasil', 'Taza grande', 6700],
  ['filtrado', 'Colombia', 'Pocillo', 4280],
  ['filtrado', 'Colombia', 'Mediano', 5900],
  ['filtrado', 'Colombia', 'Taza grande', 7700],
  ['filtrado', 'Etiopía', 'Pocillo', 4640],
  ['filtrado', 'Etiopía', 'Mediano', 6800],
  ['filtrado', 'Etiopía', 'Taza grande', 9200],
] as const;

describe('Catálogo completo', () => {
  test('contiene 20 productos con identificadores únicos', async () => {
    const respuesta = await request(app).get('/productos');

    expect(respuesta.status).toBe(200);

    const productos = respuesta.body as ProductoApi[];
    expect(productos).toHaveLength(20);
    expect(new Set(productos.map((producto) => producto.id)).size).toBe(20);
  });

  test.each(combinaciones)(
    '%s de %s, tamaño %s, cuesta %i',
    async (tipo, origen, tamanio, precio) => {
      const respuesta = await request(app).get('/productos');
      const productos = respuesta.body as ProductoApi[];

      const coincidencias = productos.filter(
        (producto) =>
          producto.tipo === tipo &&
          producto.variedad?.nombre === origen &&
          producto.tamanio === tamanio,
      );

      expect(coincidencias).toHaveLength(1);
      expect(coincidencias[0].precio).toBe(precio);
    },
  );

  test('contiene las dos opciones de pastelería con sus precios', async () => {
    const respuesta = await request(app).get('/productos');
    const productos = respuesta.body as ProductoApi[];

    const pasteleria = productos.filter(
      (producto) => producto.tipo === 'pasteleria',
    );

    expect(pasteleria).toHaveLength(2);
    expect(pasteleria).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 7,
          nombre: 'Muffins de chocolate',
          precio: 2500,
        }),
        expect.objectContaining({
          id: 8,
          nombre: 'Torta selva negra',
          precio: 4200,
        }),
      ]),
    );
  });
});