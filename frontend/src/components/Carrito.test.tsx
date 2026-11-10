import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CarritoProvider, useCarrito } from '../context/CarritoContext';
import { productosEjemplo } from '../test/productosEjemplo';
import Carrito from './Carrito';

afterEach(cleanup);

function Escenario({ onConfirmar }: { onConfirmar: () => void }) {
  const { agregar } = useCarrito();
  return <>
    <button onClick={() => agregar(productosEjemplo[1])}>Agregar café</button>
    <button onClick={() => agregar(productosEjemplo[5])}>Agregar pastelería</button>
    <Carrito onConfirmar={onConfirmar} />
  </>;
}

describe('Carrito', () => {
  it('muestra vacío y bloquea Confirmar sin productos', () => {
    render(<CarritoProvider><Carrito /></CarritoProvider>);
    expect(screen.getByText('Tu pedido está vacío')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirmar' })).toBeDisabled();
  });

  it('muestra precios, cantidades y subtotales; permite modificar y vaciar', async () => {
    const user = userEvent.setup();
    const onConfirmar = vi.fn();
    render(<CarritoProvider><Escenario onConfirmar={onConfirmar} /></CarritoProvider>);
    await user.click(screen.getByRole('button', { name: 'Agregar café' }));
    await user.click(screen.getByRole('button', { name: 'Agregar pastelería' }));

    const carrito = screen.getByRole('region', { name: 'Carrito' });
    expect(within(carrito).getByText('Expreso Mediano')).toBeInTheDocument();
    expect(within(carrito).getByText('Muffin de chocolate')).toBeInTheDocument();
    expect(within(carrito).getByText('Total: $10.860')).toBeInTheDocument();
    expect(within(carrito).getByText('Unitario: $7.360')).toBeInTheDocument();
    expect(within(carrito).getByText('Subtotal: $7.360')).toBeInTheDocument();
    await user.click(within(carrito).getByRole('button', { name: 'Sumar Expreso Mediano' }));
    expect(within(carrito).getByText('Total: $18.220')).toBeInTheDocument();
    await user.click(within(carrito).getByRole('button', { name: 'Restar Expreso Mediano' }));
    expect(within(carrito).getByText('Total: $10.860')).toBeInTheDocument();
    await user.click(within(carrito).getByRole('button', { name: 'Quitar Muffin de chocolate' }));
    expect(within(carrito).getByText('Total: $7.360')).toBeInTheDocument();
    await user.click(within(carrito).getByRole('button', { name: 'Confirmar' }));
    expect(onConfirmar).toHaveBeenCalledOnce();
    await user.click(within(carrito).getByRole('button', { name: 'Vaciar carrito' }));
    expect(within(carrito).getByText('Tu pedido está vacío')).toBeInTheDocument();
  });

  it('restar la última unidad elimina el producto y deshabilita Confirmar', async () => {
    const user = userEvent.setup();
    render(<CarritoProvider><Escenario onConfirmar={() => {}} /></CarritoProvider>);
    await user.click(screen.getByRole('button', { name: 'Agregar café' }));
    const carrito = screen.getByRole('region', { name: 'Carrito' });
    await user.click(within(carrito).getByRole('button', { name: 'Restar Expreso Mediano' }));
    expect(within(carrito).getByText('Tu pedido está vacío')).toBeInTheDocument();
    expect(within(carrito).getByRole('button', { name: 'Confirmar' })).toBeDisabled();
  });
});
