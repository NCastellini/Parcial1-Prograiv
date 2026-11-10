import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CarritoProvider, useCarrito } from './CarritoContext';
import { productosEjemplo } from '../test/productosEjemplo';

afterEach(cleanup);

function Controles() {
  const { items, agregar, sumar, restar, quitar, vaciar } = useCarrito();
  const producto = productosEjemplo[1];
  return <>
    <button onClick={() => agregar(producto)}>Agregar</button>
    <button onClick={() => sumar(producto.id)}>Sumar</button>
    <button onClick={() => restar(producto.id)}>Restar</button>
    <button onClick={() => quitar(producto.id)}>Quitar</button>
    <button onClick={vaciar}>Vaciar</button>
    <output>{JSON.stringify(items)}</output>
  </>;
}

describe('CarritoContext', () => {
  it('comparte el estado y aplica todas las operaciones del reducer', async () => {
    const user = userEvent.setup();
    render(<CarritoProvider><Controles /></CarritoProvider>);
    const estado = () => JSON.parse(screen.getByRole('status').textContent || '[]') as { cantidad: number }[];

    expect(estado()).toEqual([]);
    await user.click(screen.getByRole('button', { name: 'Agregar' }));
    await user.click(screen.getByRole('button', { name: 'Agregar' }));
    expect(estado()).toHaveLength(1);
    expect(estado()[0].cantidad).toBe(2);

    await user.click(screen.getByRole('button', { name: 'Sumar' }));
    expect(estado()[0].cantidad).toBe(3);
    await user.click(screen.getByRole('button', { name: 'Restar' }));
    expect(estado()[0].cantidad).toBe(2);
    await user.click(screen.getByRole('button', { name: 'Quitar' }));
    expect(estado()).toEqual([]);

    await user.click(screen.getByRole('button', { name: 'Agregar' }));
    await user.click(screen.getByRole('button', { name: 'Vaciar' }));
    expect(estado()).toEqual([]);
  });
});
