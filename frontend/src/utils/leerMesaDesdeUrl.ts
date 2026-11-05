export function leerMesaDesdeUrl(url: string): number | null {
  const parametros = new URL(url, 'http://localhost');
  const valorMesa = parametros.searchParams.get('mesa');

  if (!valorMesa || !/^[0-9]+$/.test(valorMesa)) {
    return null;
  }

  const mesa = Number(valorMesa);

  if (!Number.isSafeInteger(mesa) || mesa <= 0) {
    return null;
  }

  return mesa;
}
