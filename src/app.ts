import express from 'express';
import cors from 'cors';
import { productosRouter } from './routes/productos.route.js';
import { pedidosRouter } from './routes/pedidos.route.js';
import { reportesRouter } from './routes/reportes.router.js';
import { manejarErrores, rutaNoEncontrada } from './middlewares/errores.js';
import { testRouter } from './routes/test.route.js';

export const app = express();

app.use(express.json());
app.use(cors({ origin: /^http:\/\/localhost:\d+$/ }));

app.use('/productos', productosRouter);
app.use('/pedidos', pedidosRouter);
app.use('/reportes', reportesRouter);

if (process.env.NODE_ENV === 'test') {
    app.use('/__test__', testRouter);
}

app.use(rutaNoEncontrada);
app.use(manejarErrores);