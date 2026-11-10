import { expect, test } from '@playwright/test';

const api = 'http://127.0.0.1:3001';

test.beforeEach(async ({ request }) => {
  const reset = await request.post(`${api}/__test__/reset`);
  expect(reset.status()).toBe(200);

  const seed = await request.post(`${api}/__test__/seed`);
  expect(seed.status()).toBe(200);
  expect(await seed.json()).toEqual({ ok: true, productos: 20 });
});

test('QR, café, pastelería, confirmación y seguimiento con API real', async ({ page }) => {
  await page.goto('/?mesa=4');
  await expect(page.getByRole('heading', { name: 'Mesa 4' })).toBeVisible();

  await page.getByRole('radio', { name: 'Expreso' }).check();
  await page.getByRole('radio', { name: 'Mediano' }).check();
  await page.getByRole('radio', { name: /Colombia/ }).check();
  await page.getByRole('button', { name: 'Agregar', exact: true }).click();

  const pasteleria = page.getByRole('region', { name: 'Pastelería' });
  await pasteleria.getByRole('button', { name: 'Agregar al carrito' }).first().click();

  const carrito = page.getByRole('region', { name: 'Carrito' });
  await expect(carrito.getByText('Total: $9.860')).toBeVisible();
  await carrito.getByRole('button', { name: 'Confirmar' }).click();

  const respuestaPendiente = page.waitForResponse((respuesta) =>
    respuesta.url().endsWith('/pedidos') && respuesta.request().method() === 'POST',
  );
  await page.getByRole('button', { name: 'Confirmar pedido' }).click();
  const respuesta = await respuestaPendiente;

  expect(respuesta.status()).toBe(201);
  expect(respuesta.request().postDataJSON()).toEqual({
    mesaID: 4,
    items: [
      { productoId: 2, cantidad: 1 },
      { productoId: 7, cantidad: 1 },
    ],
  });

  const pedido = await respuesta.json();
  await expect(page.getByText(`Pedido #${pedido.id}`)).toBeVisible();
  await expect(page.getByText('Estado: pendiente')).toBeVisible();
  await expect(page.getByText('Total: $9.860')).toBeVisible();

  await page.getByRole('button', { name: 'Consultar estado' }).click();
  await expect(page.getByRole('status')).toHaveText('Estado: pendiente');
});
