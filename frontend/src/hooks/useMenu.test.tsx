import { describe, expect, it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../test/server';
import { useMenu } from './useMenu';

describe('useMenu', () => {
  it('comienza en estado cargando', () => {
    const { result } = renderHook(() => useMenu());

    expect(result.current.estado.estado).toBe('cargando');
  });

  it('carga los productos y cambia al estado listo', async () => {
    server.use(
      http.get('/productos', () => {
        return HttpResponse.json([
          {
            id: 1,
            tipo: 'expreso',
            nombre: 'Expreso Colombia',
            precio: 3500,
            tamanio: 'Mediano',
            variedad: {
              nombre: 'Colombia',
              descripcion: 'Café de origen colombiano',
            },
          },
          {
            id: 2,
            tipo: 'pasteleria',
            nombre: 'Medialuna',
            precio: 1500,
          },
        ]);
      }),
    );

    const { result } = renderHook(() => useMenu());

    await waitFor(() => {
      expect(result.current.estado.estado).toBe('listo');
    });

    if (result.current.estado.estado !== 'listo') {
      throw new Error('El menú no alcanzó el estado listo');
    }

    expect(result.current.estado.productos).toHaveLength(2);
    expect(result.current.estado.productos[0].nombre).toBe(
      'Expreso Colombia',
    );
  });
});
