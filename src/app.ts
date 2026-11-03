import express from 'express';
import { productosRouter } from './routes/productos.route.js';
import { pedidosRouter } from './routes/pedidos.route.js';
import { reportesRouter } from './routes/reportes.router.js';
import { manejarErrores, rutaNoEncontrada } from './middlewares/errores.js';

export const app = express();

app.use(express.json());

app.use('/productos', productosRouter);
app.use('/pedidos', pedidosRouter);
app.use('/reportes', reportesRouter);
app.use(rutaNoEncontrada);
app.use(manejarErrores);