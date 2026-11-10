import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../test/server';
import SeguimientoPedido from './SeguimientoPedido';

const pedidoEjemplo = {
  id: 5,
  estado: 'pendiente',
  items: [{ productoId: 2, cantidad: 2, precioUnitario: 7360 }],
  total: 14720,
  mesaID: 4,
};

afterEach(() => {
  cleanup();
});

describe('SeguimientoPedido', () => {
  it('SeguimientoPedido llama GET /pedidos/:id con el id correcto', async () => {
    const rutas: string[] = [];

    server.use(
      http.get('/pedidos/:id', ({ request }) => {
        rutas.push(new URL(request.url).pathname);
        return HttpResponse.json(pedidoEjemplo);
      }),
    );

    const user = userEvent.setup();
    render(<SeguimientoPedido pedidoId={5} />);

    await user.click(screen.getByRole('button', { name: /consultar estado/i }));

    await waitFor(() => {
      expect(rutas).toHaveLength(1);
    });

    expect(rutas[0]).toBe('/pedidos/5');
  });

  it('SeguimientoPedido muestra el estado actual del pedido', async () => {
    server.use(
      http.get('/pedidos/:id', () =>
        HttpResponse.json({ ...pedidoEjemplo, estado: 'en_preparacion' }),
      ),
    );

    const user = userEvent.setup();
    render(<SeguimientoPedido pedidoId={5} />);

    await user.click(screen.getByRole('button', { name: /consultar estado/i }));

    expect(
      await screen.findByText(/estado: en_preparacion/i),
    ).toBeInTheDocument();
  });

  it('actualiza el estado al consultar otra vez sin recargar la página', async () => {
    let consultas = 0;
    server.use(http.get('/pedidos/:id', () => {
      consultas++;
      return HttpResponse.json({ ...pedidoEjemplo, estado: consultas === 1 ? 'pendiente' : 'en_preparacion' });
    }));
    const user = userEvent.setup();
    render(<SeguimientoPedido pedidoId={5} />);
    await user.click(screen.getByRole('button', { name: 'Consultar estado' }));
    expect(await screen.findByRole('status')).toHaveTextContent('Estado: pendiente');
    await user.click(screen.getByRole('button', { name: 'Consultar estado' }));
    expect(await screen.findByRole('status')).toHaveTextContent('Estado: en_preparacion');
  });

  it('muestra el error de la API y permite volver a consultar', async () => {
    let consultas = 0;
    server.use(http.get('/pedidos/:id', () => {
      consultas++;
      return consultas === 1
        ? HttpResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
        : HttpResponse.json(pedidoEjemplo);
    }));
    const user = userEvent.setup();
    render(<SeguimientoPedido pedidoId={5} />);
    await user.click(screen.getByRole('button', { name: 'Consultar estado' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Pedido no encontrado');
    expect(screen.getByRole('button', { name: 'Consultar estado' })).toBeEnabled();
    await user.click(screen.getByRole('button', { name: 'Consultar estado' }));
    expect(await screen.findByRole('status')).toHaveTextContent('Estado: pendiente');
  });

  it('muestra un mensaje genérico si la API está caída', async () => {
    server.use(http.get('/pedidos/:id', () => HttpResponse.error()));
    render(<SeguimientoPedido pedidoId={5} />);
    await userEvent.setup().click(screen.getByRole('button', { name: 'Consultar estado' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo consultar el pedido');
    expect(screen.getByRole('button', { name: 'Consultar estado' })).toBeEnabled();
  });
});
