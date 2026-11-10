import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render, screen, cleanup, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { productosEjemplo } from './test/productosEjemplo';
import App from './App';
import { http, HttpResponse } from 'msw';
import { server } from './test/server';

describe('Integración de App con mesa desde URL', () => {
  beforeEach(() => {
    server.use(
        http.get('/productos', () => {
            return HttpResponse.json([]);
        }),
    );
  });
  afterEach(() => {
    cleanup();
    window.history.replaceState({}, '', '/');
  });

  it('muestra la mesa indicada en la URL', () => {
    window.history.replaceState({}, '', '/?mesa=4');

    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Mesa 4' })
    ).toBeInTheDocument();
  });

  it('muestra retiro en barra cuando no hay mesa', () => {
    window.history.replaceState({}, '', '/');

    render(<App />);

    expect(
      screen.getByRole('heading', {
        name: 'Para retirar en la barra',
      })
    ).toBeInTheDocument();
  });

  it('muestra retiro en barra cuando la mesa es inválida', () => {
    window.history.replaceState({}, '', '/?mesa=abc');

    render(<App />);

    expect(
      screen.getByRole('heading', {
        name: 'Para retirar en la barra',
      })
    ).toBeInTheDocument();
  });

  it('muestra el catálogo de productos en la página principal', async () => {
    server.use(
        http.get('/productos', () =>
        HttpResponse.json([
            {
            id: 1,
            tipo: 'pasteleria',
            nombre: 'Medialuna',
            precio: 1500,
            },
        ]),
        ),
    );

    window.history.replaceState({}, '', '/?mesa=4');

    render(<App />);

    expect(
        screen.getByRole('heading', { name: 'Mesa 4' }),
    ).toBeInTheDocument();

    expect(
        await screen.findByText('Medialuna'),
    ).toBeInTheDocument();

    expect(screen.getByText('$1.500')).toBeInTheDocument();
  });

  it('carga el catálogo una vez y agrega el café seleccionado al carrito', async () => {
    let consultas = 0;
    server.use(http.get('/productos', () => {
      consultas++;
      return HttpResponse.json(productosEjemplo);
    }));
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole('region', { name: 'Armá tu café' });

    await user.click(screen.getByRole('radio', { name: 'Expreso' }));
    await user.click(screen.getByRole('radio', { name: 'Mediano' }));
    await user.click(screen.getByRole('radio', { name: /Colombia/ }));
    const agregar = screen.getByRole('button', { name: 'Agregar' });
    expect(agregar).toBeEnabled();
    await user.click(agregar);
    await user.click(agregar);

    const carrito = screen.getByRole('region', { name: 'Carrito' });
    expect(within(carrito).getByText('Expreso Mediano')).toBeInTheDocument();
    expect(within(carrito).getByText('Cantidad: 2')).toBeInTheDocument();
    expect(within(carrito).getByText('Total: $14.720')).toBeInTheDocument();
    expect(consultas).toBe(1);
  });

  it('mantiene deshabilitado Agregar para una combinación ausente', async () => {
    server.use(http.get('/productos', () => HttpResponse.json(productosEjemplo)));
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole('region', { name: 'Armá tu café' });
    await user.click(screen.getByRole('radio', { name: 'Filtrado' }));
    await user.click(screen.getByRole('radio', { name: 'Pocillo' }));
    await user.click(screen.getByRole('radio', { name: /Brasil/ }));
    expect(screen.getByRole('button', { name: 'Agregar' })).toBeDisabled();
    expect(screen.getByText('Tu pedido está vacío')).toBeInTheDocument();
  });

  it('agrega pastelería y permite confirmar con la mesa de la URL', async () => {
    const enviados: unknown[] = [];
    server.use(
      http.get('/productos', () => HttpResponse.json(productosEjemplo)),
      http.get('/pedidos/33', () => HttpResponse.json({ id: 33, estado: 'pendiente', items: [], total: 3500, mesaID: 4 })),
      http.post('/pedidos', async ({ request }) => {
        enviados.push(await request.json());
        return HttpResponse.json({ id: 33, estado: 'pendiente', items: [], total: 3500, mesaID: 4 }, { status: 201 });
      }),
    );
    window.history.replaceState({}, '', '/?mesa=4');
    const user = userEvent.setup();
    render(<App />);

    const pasteleria = await screen.findByRole('region', { name: 'Pastelería' });
    await user.click(within(pasteleria).getByRole('button', { name: 'Agregar al carrito' }));
    const carrito = screen.getByRole('region', { name: 'Carrito' });
    expect(within(carrito).getByText('Total: $3.500')).toBeInTheDocument();

    await user.click(within(carrito).getByRole('button', { name: 'Confirmar' }));
    await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }));
    expect(await screen.findByText('Pedido #33')).toBeInTheDocument();
    expect(enviados).toEqual([{ items: [{ productoId: 19, cantidad: 1 }], mesaID: 4 }]);
    await user.click(screen.getByRole('button', { name: 'Consultar estado' }));
    expect(await screen.findByRole('status')).toHaveTextContent('Estado: pendiente');
    expect(within(carrito).getByText('Tu pedido está vacío')).toBeInTheDocument();
  });

  it('conserva el carrito cuando la confirmación responde 4xx', async () => {
    server.use(
      http.get('/productos', () => HttpResponse.json(productosEjemplo)),
      http.post('/pedidos', () => HttpResponse.json({ error: 'Mesa inválida' }, { status: 400 })),
    );
    const user = userEvent.setup();
    render(<App />);
    const pasteleria = await screen.findByRole('region', { name: 'Pastelería' });
    await user.click(within(pasteleria).getByRole('button', { name: 'Agregar al carrito' }));
    await user.click(within(screen.getByRole('region', { name: 'Carrito' })).getByRole('button', { name: 'Confirmar' }));
    await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Mesa inválida');
    expect(within(screen.getByRole('region', { name: 'Carrito' })).getByText('Total: $3.500')).toBeInTheDocument();
  });
});
