import { expect, test } from '@playwright/test';

// Recorrido feliz completo contra el frontend y la API reales.
// Cada test es autónomo: el beforeEach de reset/seed deja la base
// en estado conocido para que los pedidos sean deterministas.

test.describe('Recorrido feliz', () => {
  test('abrir menú desde QR con ?mesa=4', async ({ page }) => {
    await page.goto('/?mesa=4');

    // El QR deeplinkea con la mesa en la URL y el header la muestra.
    await expect(
      page.getByRole('heading', { name: 'Mesa 4' }),
    ).toBeVisible();

    await expect(
      page.getByRole('heading', { name: 'Menú de Cafetería Origen' }),
    ).toBeVisible();

    // El menú carga desde la API real: aparecen las opciones del selector
    // de cafés y la pastelería.
    await expect(page.getByRole('radio', { name: /Colombia/ })).toBeVisible();
    await expect(page.getByText('Muffins de chocolate')).toBeVisible();
  });

  test('elegir expreso mediano Colombia y agregar al carrito', async ({ page }) => {
    await page.goto('/?mesa=4');

    // Se arma el café por pasos: bebida, tamaño y origen.
    await page.getByRole('radio', { name: 'Expreso', exact: true }).check();
    await page.getByRole('radio', { name: 'Mediano', exact: true }).check();
    await page.getByRole('radio', { name: /Colombia/ }).check();

    await page.getByRole('button', { name: 'Agregar', exact: true }).click();

    // El carrito muestra el producto elegido con su cantidad.
    await expect(
      page
        .getByRole('listitem')
        .filter({ hasText: 'Expreso Colombia (Mediano)' }),
    ).toBeVisible();
    await expect(
      page
        .getByRole('listitem')
        .filter({ hasText: 'Expreso Colombia (Mediano)' }),
    ).toContainText('× 1');
  });
});
