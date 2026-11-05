import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Menu from './Menu';
import { useMenu } from '../hooks/useMenu';

vi.mock('../hooks/useMenu', () => ({
  useMenu: vi.fn(),
}));

describe('Menu', () => {
  it('muestra un indicador mientras se carga el menú', () => {
    vi.mocked(useMenu).mockReturnValue({
      estado: { estado: 'cargando' },
      reintentar: vi.fn(),
    });

    render(<Menu />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Cargando menú...')).toBeInTheDocument();
  });
});
