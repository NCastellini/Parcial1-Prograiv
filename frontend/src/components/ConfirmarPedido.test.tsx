import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../test/server';
import ConfirmarPedido from './ConfirmarPedido';

const itemsCarrito = [
  { id: 2, nombre: 'Expreso Colombia (Mediano)', precio: 7360, cantidad: 2 },
  { id: 7, nombre: 'Muffins de chocolate', precio: 2500, cantidad: 1 },
];

afterEach(() => {
  cleanup();
});

describe('ConfirmarPedido', () => {
  it('al confirmar se envía POST /pedidos con los items correctos', async () => {
    const cuerpos: unknown[] = [];

    server.use(
      http.post('/pedidos', async ({ request }) => {
        cuerpos.push(await request.json());
        return HttpResponse.json(
          { id: 1, estado: 'pendiente', items: [], total: 17220 },
          { status: 201 },
        );
      }),
    );

    const user = userEvent.setup();
    render(<ConfirmarPedido items={itemsCarrito} mesa={null} />);

    await user.click(screen.getByRole('button', { name: /confirmar pedido/i }));

    await waitFor(() => {
      expect(cuerpos).toHaveLength(1);
    });

    const cuerpo = cuerpos[0] as {
      items: { productoId: number; cantidad: number }[];
    };

    expect(cuerpo.items).toEqual([
      { productoId: 2, cantidad: 2 },
      { productoId: 7, cantidad: 1 },
    ]);
  });

  it('al confirmar se incluye mesaId en el body del POST', async () => {
    const cuerpos: unknown[] = [];

    server.use(
      http.post('/pedidos', async ({ request }) => {
        cuerpos.push(await request.json());
        return HttpResponse.json(
          { id: 2, estado: 'pendiente', items: [], total: 14720, mesaID: 4 },
          { status: 201 },
        );
      }),
    );

    const user = userEvent.setup();
    render(<ConfirmarPedido items={itemsCarrito} mesa={4} />);

    await user.click(screen.getByRole('button', { name: /confirmar pedido/i }));

    await waitFor(() => {
      expect(cuerpos).toHaveLength(1);
    });

    expect(cuerpos[0]).toEqual({
      items: [
        { productoId: 2, cantidad: 2 },
        { productoId: 7, cantidad: 1 },
      ],
      mesaID: 4,
    });
  });

  it('POST /pedidos sin mesa envía el body sin mesaId', async () => {
    const cuerpos: unknown[] = [];

    server.use(
      http.post('/pedidos', async ({ request }) => {
        cuerpos.push(await request.json());
        return HttpResponse.json(
          { id: 3, estado: 'pendiente', items: [], total: 17220 },
          { status: 201 },
        );
      }),
    );

    const user = userEvent.setup();
    render(<ConfirmarPedido items={itemsCarrito} mesa={null} />);

    await user.click(screen.getByRole('button', { name: /confirmar pedido/i }));

    await waitFor(() => {
      expect(cuerpos).toHaveLength(1);
    });

    expect(cuerpos[0]).toEqual({
      items: [
        { productoId: 2, cantidad: 2 },
        { productoId: 7, cantidad: 1 },
      ],
    });
  });

  it('después de confirmar se muestra el número de pedido de la API', async () => {
    server.use(
      http.post('/pedidos', () =>
        HttpResponse.json(
          { id: 7, estado: 'pendiente', items: [], total: 17220, mesaID: 4 },
          { status: 201 },
        ),
      ),
    );

    const user = userEvent.setup();
    render(<ConfirmarPedido items={itemsCarrito} mesa={4} />);

    await user.click(screen.getByRole('button', { name: /confirmar pedido/i }));

    expect(
      await screen.findByText('Pedido #7'),
    ).toBeInTheDocument();
  });

  it('después de confirmar se muestra el estado del pedido', async () => {
    server.use(
      http.post('/pedidos', () =>
        HttpResponse.json(
          { id: 7, estado: 'pendiente', items: [], total: 17220, mesaID: 4 },
          { status: 201 },
        ),
      ),
    );

    const user = userEvent.setup();
    render(<ConfirmarPedido items={itemsCarrito} mesa={4} />);

    await user.click(screen.getByRole('button', { name: /confirmar pedido/i }));

    expect(
      await screen.findByText(/estado: pendiente/i),
    ).toBeInTheDocument();
  });

  it('después de confirmar se muestra el total que devolvió la API', async () => {
    // Total distinto al que calcularía el front (7360*2 + 2500 = 17220)
    // para verificar que se muestra el de la API y no uno calculado localmente.
    server.use(
      http.post('/pedidos', () =>
        HttpResponse.json(
          { id: 7, estado: 'pendiente', items: [], total: 19999, mesaID: 4 },
          { status: 201 },
        ),
      ),
    );

    const user = userEvent.setup();
    render(<ConfirmarPedido items={itemsCarrito} mesa={4} />);

    await user.click(screen.getByRole('button', { name: /confirmar pedido/i }));

    expect(
      await screen.findByText('Total: $19.999'),
    ).toBeInTheDocument();

    expect(screen.queryByText('$17.220')).not.toBeInTheDocument();
  });

  it('error 4xx al confirmar muestra el mensaje de la API', async () => {
    server.use(
      http.post('/pedidos', () =>
        HttpResponse.json(
          { error: 'El producto Muffins de chocolate no tiene stock' },
          { status: 400 },
        ),
      ),
    );

    const user = userEvent.setup();
    render(<ConfirmarPedido items={itemsCarrito} mesa={4} />);

    await user.click(screen.getByRole('button', { name: /confirmar pedido/i }));

    expect(
      await screen.findByText('El producto Muffins de chocolate no tiene stock'),
    ).toBeInTheDocument();
  });

  it('error 4xx al confirmar no vacía el carrito', async () => {
    server.use(
      http.post('/pedidos', () =>
        HttpResponse.json(
          { error: 'El producto Muffins de chocolate no tiene stock' },
          { status: 400 },
        ),
      ),
    );

    const user = userEvent.setup();
    render(<ConfirmarPedido items={itemsCarrito} mesa={4} />);

    await user.click(screen.getByRole('button', { name: /confirmar pedido/i }));

    expect(
      await screen.findByText('El producto Muffins de chocolate no tiene stock'),
    ).toBeInTheDocument();

    // El carrito sigue intacto: los items siguen visibles.
    expect(
      await screen.findByText('Expreso Colombia (Mediano)'),
    ).toBeInTheDocument();
    expect(screen.getByText('Muffins de chocolate')).toBeInTheDocument();

    // Y se puede volver a confirmar.
    expect(
      screen.getByRole('button', { name: /confirmar pedido/i }),
    ).toBeInTheDocument();
  });

  it('error 500 al confirmar muestra mensaje con botón reintentar', async () => {
    const pedidos: unknown[] = [];

    server.use(
      http.post('/pedidos', async ({ request }) => {
        pedidos.push(await request.json());
        return HttpResponse.json(
          { error: 'Error interno del servidor' },
          { status: 500 },
        );
      }),
    );

    const user = userEvent.setup();
    render(<ConfirmarPedido items={itemsCarrito} mesa={4} />);

    await user.click(screen.getByRole('button', { name: /confirmar pedido/i }));

    expect(
      await screen.findByText('Error interno del servidor'),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /reintentar/i }));

    await waitFor(() => {
      expect(pedidos).toHaveLength(2);
    });
  });

  it('API caída muestra mensaje de error genérico', async () => {
    server.use(http.post('/pedidos', () => HttpResponse.error()));

    const user = userEvent.setup();
    render(<ConfirmarPedido items={itemsCarrito} mesa={4} />);

    await user.click(screen.getByRole('button', { name: /confirmar pedido/i }));

    expect(
      await screen.findByText(
        'No se pudo conectar con el servidor. Intentá de nuevo en unos minutos.',
      ),
    ).toBeInTheDocument();

    // No filtramos el mensaje técnico del error de red.
    expect(
      screen.queryByText(/failed to fetch|fetch failed/i),
    ).not.toBeInTheDocument();
  });
});
