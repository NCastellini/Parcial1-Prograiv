import { describe, expect, it } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../test/server';
import { useMenu } from './useMenu';

describe('useMenu', () => {
    it('comienza en estado cargando', () => {
    server.use(
        http.get('/productos', async () => {
        await new Promise(() => {});
        return HttpResponse.json([]);
        }),
    );

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

  
    it('cambia al estado error cuando falla la API', async () => {
    server.use(
        http.get('/productos', () => {
        return HttpResponse.json(
            { error: 'No se pudo cargar el catálogo' },
            { status: 500 },
        );
        }),
    );

    const { result } = renderHook(() => useMenu());

    await waitFor(() => {
        expect(result.current.estado.estado).toBe('error');
    });

    if (result.current.estado.estado !== 'error') {
        throw new Error('El menú no alcanzó el estado error');
    }

    expect(result.current.estado.mensaje).toBe(
        'No se pudo cargar el catálogo',
    );
    });


    it('permite reintentar la carga después de un error', async () => {
    let intentos = 0;

    server.use(
        http.get('/productos', () => {
        intentos++;

        if (intentos === 1) {
            return HttpResponse.json(
            { error: 'Servicio temporalmente no disponible' },
            { status: 503 },
            );
        }

        return HttpResponse.json([
            {
            id: 1,
            tipo: 'pasteleria',
            nombre: 'Medialuna',
            precio: 1500,
            },
        ]);
        }),
    );

    const { result } = renderHook(() => useMenu());

    await waitFor(() => {
        expect(result.current.estado.estado).toBe('error');
    });

    act(() => {
        result.current.reintentar();
    });

    expect(result.current.estado.estado).toBe('cargando');

    await waitFor(() => {
        expect(result.current.estado.estado).toBe('listo');
    });

    if (result.current.estado.estado !== 'listo') {
        throw new Error('El menú no alcanzó el estado listo');
    }

    expect(result.current.estado.productos[0].nombre).toBe(
        'Medialuna',
    );
    expect(intentos).toBe(2);
    });

});
