# Cafetería Origen — Frontend TP3

## Tecnologías

- React + TypeScript (modo estricto).
- Vite 7.
- Bootstrap 5 + SASS.
- Vitest 3 y React Testing Library.
- MSW 2 para simular respuestas HTTP en las pruebas.
- Zod 4 para validar las respuestas de la API.
- Playwright para pruebas E2E.

## Instalación y ejecución

Desde la carpeta `frontend/`:

```bash
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:5173`.

El backend debe iniciarse por separado desde la raíz del repositorio, utilizando el comando correspondiente a la API.

Vite utiliza un proxy para redirigir las solicitudes `/productos` y `/pedidos` al backend.

## Funcionalidades implementadas

### Lectura de mesa desde QR

La aplicación identifica la mesa mediante el parámetro `mesa` de la URL.

Ejemplo:

`http://localhost:5173/?mesa=4`

- Si el parámetro es válido, muestra `Mesa 4`.
- Si está ausente o es inválido, muestra `Para retirar en la barra`.

### Carga del menú

El componente `Menu` utiliza el hook `useMenu` para consultar `GET /productos`.

El hook utiliza una unión discriminada de tres estados:

- `cargando`: muestra un indicador de carga.
- `listo`: muestra los productos recibidos.
- `error`: muestra el mensaje de error y un botón para reintentar.

Las respuestas se validan mediante Zod antes de utilizarse.

### Confirmación de pedido

El componente `ConfirmarPedido` recibe los items del carrito y la mesa
detectada en la URL, y al confirmar envía `POST /pedidos` con el body:

- `items`: array de `{ productoId, cantidad }` mapeado desde el carrito.
- `mesaID`: solo se incluye cuando hay mesa detectada (retiro en barra lo omite).

Al confirmar, la vista de confirmación muestra el número de pedido, el estado
y el total **devueltos por la API** (no valores calculados en el front).

### Seguimiento de pedido

El componente `SeguimientoPedido` consulta `GET /pedidos/:id` con el id
recibido y muestra el estado actual, sin recargar la página.

### Manejo de errores al confirmar

`ConfirmarPedido` distingue tres casos al fallar `POST /pedidos`:

- **Error 4xx**: muestra el mensaje que devolvió la API (por ejemplo, falta de
  stock) y conserva el carrito con sus items, permitiendo confirmar de nuevo.
- **Error 500**: muestra el mensaje y ofrece un botón `Reintentar` que vuelve a
  enviar el pedido (el fallo es transitorio del lado del servidor).
- **API caída**: muestra un mensaje genérico de conexión, sin filtrar el error
  técnico de red al usuario.

El cliente HTTP (`src/api/client.ts`) lanza `ApiError` con el código de
estado HTTP para que los componentes puedan distinguir los casos anteriores.

## Contrato esperado de la API

### GET /productos

Devuelve un arreglo de productos.

Todos los productos incluyen:

- `id`: número entero.
- `nombre`: texto.
- `tipo`: `expreso`, `filtrado` o `pasteleria`.
- `precio`: número.

Los productos de café también incluyen:

- `tamanio`: texto.
- `variedad.nombre`: texto.
- `variedad.descripcion`: texto.

### GET /productos/:id

Devuelve un producto con el mismo formato.

### POST /pedidos

Recibe:

```json
{
  "items": [
    {
      "productoId": 1,
      "cantidad": 2
    }
  ],
  "mesaID": 4
}
```

El campo `mesaID` es opcional.

### GET /pedidos/:id

Devuelve un pedido con `id`, `estado`, `items`, `total` y, opcionalmente, `mesaID`.

### Errores

El formato esperado es:

```json
{
  "error": "Mensaje descriptivo"
}
```

## Pruebas

Para ejecutar los tests unitarios, de componentes e integración:

```bash
npm test
```

Para verificar la compilación:

```bash
npm run build
```