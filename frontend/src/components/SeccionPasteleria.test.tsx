import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { productosEjemplo } from '../test/productosEjemplo';
import SeccionPasteleria from './SeccionPasteleria';

afterEach(cleanup);

describe('SeccionPasteleria', () => {
  it('muestra solo pastelería con el precio real y permite agregarla', async () => {
    const onAgregar = vi.fn();
    render(<SeccionPasteleria productos={productosEjemplo} onAgregar={onAgregar} />);
    const seccion = screen.getByRole('region', { name: 'Pastelería' });
    expect(within(seccion).getByText('Muffin de chocolate')).toBeInTheDocument();
    expect(within(seccion).getByText('$3.500')).toBeInTheDocument();
    expect(within(seccion).queryByText('Expreso Mediano')).not.toBeInTheDocument();
    await userEvent.setup().click(within(seccion).getByRole('button', { name: 'Agregar al carrito' }));
    expect(onAgregar).toHaveBeenCalledWith(productosEjemplo[5]);
  });
});
