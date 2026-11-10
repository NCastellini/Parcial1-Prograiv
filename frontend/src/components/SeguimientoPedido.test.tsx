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
});
