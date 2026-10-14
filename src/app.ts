import express from 'express';
import { productosRouter } from './routes/productos.route.js';
import { pedidosRouter } from './routes/pedidos.route.js';

export const app = express();

app.use(express.json());

app.use('/productos', productosRouter);
app.use('/pedidos', pedidosRouter);