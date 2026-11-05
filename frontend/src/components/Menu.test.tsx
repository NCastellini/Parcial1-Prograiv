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

    it('muestra los productos cuando el menú está listo', () => {
    vi.mocked(useMenu).mockReturnValue({
        estado: {
        estado: 'listo',
        productos: [
            {
            id: 1,
            tipo: 'expreso',
            nombre: 'Expreso Colombia',
            precio: 3500,
            tamanio: 'Mediano',
            variedad: {
                nombre: 'Colombia',
                descripcion: 'Café de origen colombiano',
            },
            },
            {
            id: 2,
            tipo: 'pasteleria',
            nombre: 'Medialuna',
            precio: 1500,
            },
        ],
        },
        reintentar: vi.fn(),
    });

    render(<Menu />);

    expect(screen.getByText('Expreso Colombia')).toBeInTheDocument();
    expect(screen.getByText('Medialuna')).toBeInTheDocument();

    expect(screen.getByText('Expreso')).toBeInTheDocument();
    expect(screen.getByText('Pastelería')).toBeInTheDocument();

    expect(screen.getByText('$3.500')).toBeInTheDocument();
    expect(screen.getByText('$1.500')).toBeInTheDocument();
    });

});
