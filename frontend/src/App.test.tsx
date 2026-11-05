import { afterEach, describe, expect, it } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import App from './App';
import { http, HttpResponse } from 'msw';
import { server } from './test/server';

describe('Integración de App con mesa desde URL', () => {
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
});
