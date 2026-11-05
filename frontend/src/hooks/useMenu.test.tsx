import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMenu } from './useMenu';

describe('useMenu', () => {
  it('comienza en estado cargando', () => {
    const { result } = renderHook(() => useMenu());

    expect(result.current.estado.estado).toBe('cargando');
  });
});
