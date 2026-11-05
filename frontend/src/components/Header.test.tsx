import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  it('muestra el número de mesa cuando existe', () => {
    render(<Header mesa={4} />);

    expect(
      screen.getByRole('heading', { name: 'Mesa 4' })
    ).toBeInTheDocument();
  });

  it('muestra retiro en barra cuando no hay mesa', () => {
    render(<Header mesa={null} />);

    expect(
      screen.getByRole('heading', {
        name: 'Para retirar en la barra',
      })
    ).toBeInTheDocument();
  });
});
