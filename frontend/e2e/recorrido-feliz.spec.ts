import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

// Recorrido feliz completo contra el frontend y la API reales.
// Cada test es autónomo: el beforeEach de reset/seed deja la base
// en estado conocido para que los pedidos sean deterministas.

// Paso a paso del recorrido: arma un expreso Colombia mediano
// y agrega un muffin de chocolate al carrito.
async function agregarExpresoYMuffin(page: Page) {
  await page.getByRole('radio', { name: 'Expreso', exact: true }).check();
  await page.getByRole('radio', { name: 'Mediano', exact: true }).check();
  await page.getByRole('radio', { name: /Colombia/ }).check();
  await page.getByRole('button', { name: 'Agregar', exact: true }).click();

  await page
    .locator('article', { hasText: 'Muffins de chocolate' })
    .getByRole('button', { name: 'Agregar al carrito' })
    .click();
}

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

  test('agregar muffin de chocolate al carrito', async ({ page }) => {
    await page.goto('/?mesa=4');

    // La pastelería se agrega directo desde su tarjeta.
    const tarjetaMuffin = page.locator('article', {
      hasText: 'Muffins de chocolate',
    });
    await tarjetaMuffin
      .getByRole('button', { name: 'Agregar al carrito' })
      .click();

    await expect(
      page.getByRole('listitem').filter({ hasText: 'Muffins de chocolate' }),
    ).toBeVisible();
    await expect(
      page.getByRole('listitem').filter({ hasText: 'Muffins de chocolate' }),
    ).toContainText('× 1');
  });

  test('confirmar pedido y verificar número, estado y total', async ({ page }) => {
    await page.goto('/?mesa=4');
    await agregarExpresoYMuffin(page);

    await page.getByRole('button', { name: 'Confirmar pedido' }).click();

    // El número, el estado y el total son los que devuelve la API.
    await expect(page.getByText('Pedido #1')).toBeVisible();
    await expect(page.getByText('Estado: pendiente')).toBeVisible();
    // Expreso Colombia mediano ($7.360) + muffin ($2.500) = $9.860.
    await expect(page.getByText('Total: $9.860')).toBeVisible();
  });

  test('consultar seguimiento y ver estado pendiente', async ({ page }) => {
    await page.goto('/?mesa=4');
    await agregarExpresoYMuffin(page);
    await page.getByRole('button', { name: 'Confirmar pedido' }).click();
    await expect(page.getByText('Pedido #1')).toBeVisible();

    // El seguimiento consulta el pedido a la API sin recargar la página.
    await page.getByRole('button', { name: 'Consultar estado' }).click();

    await expect(page.getByRole('status')).toHaveText('Estado: pendiente');
  });
});
