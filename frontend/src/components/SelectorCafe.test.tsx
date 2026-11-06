import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SelectorCafe from './SelectorCafe';
import { productosEjemplo } from '../test/productosEjemplo';

afterEach(() => {
    cleanup();
});

function renderizar() {
    const onAgregar = vi.fn();
    const user = userEvent.setup();
    render(<SelectorCafe productos={productosEjemplo} onAgregar={onAgregar} />);
    return { user, onAgregar };
}

const botonAgregar = () => screen.getByRole('button', { name: /agregar/i });

describe('SelectorCafe', () => {
    it('muestra los tres pasos y el botón Agregar deshabilitado', () => {
        renderizar();

        expect(screen.getByRole('group', { name: 'Bebida' })).toBeInTheDocument();
        expect(screen.getByRole('group', { name: 'Tamaño' })).toBeInTheDocument();
        expect(screen.getByRole('group', { name: 'Origen' })).toBeInTheDocument();
        expect(botonAgregar()).toBeDisabled();
    });
    it('habilita Agregar cuando las tres elecciones están completas', async () => {
        const { user } = renderizar();

        await user.click(screen.getByRole('radio', { name: 'Expreso' }));
        await user.click(screen.getByRole('radio', { name: 'Mediano' }));
        await user.click(screen.getByRole('radio', { name: /colombia/i }));

        expect(botonAgregar()).toBeEnabled();
    });
    it('mantiene Agregar deshabilitado si falta la bebida', async () => {
        const { user } = renderizar();
        await user.click(screen.getByRole('radio', { name: 'Mediano' }));
        await user.click(screen.getByRole('radio', { name: /colombia/i }));
        expect(botonAgregar()).toBeDisabled();
    });

    it('mantiene Agregar deshabilitado si falta el tamaño', async () => {
        const { user } = renderizar();
        await user.click(screen.getByRole('radio', { name: 'Expreso' }));
        await user.click(screen.getByRole('radio', { name: /colombia/i }));
        expect(botonAgregar()).toBeDisabled();
    });

    it('mantiene Agregar deshabilitado si falta el origen', async () => {
        const { user } = renderizar();
        await user.click(screen.getByRole('radio', { name: 'Expreso' }));
        await user.click(screen.getByRole('radio', { name: 'Mediano' }));
        expect(botonAgregar()).toBeDisabled();
    });
    it('muestra la descripción de cada origen', () => {
        renderizar();

        expect(screen.getByText(/acidez media, cuerpo equilibrado/i)).toBeInTheDocument();
        expect(screen.getByText(/acidez baja, cuerpo alto/i)).toBeInTheDocument();
        expect(screen.getByText(/acidez alta, cuerpo ligero/i)).toBeInTheDocument();
    });
});