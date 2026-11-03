import { Request, Response, NextFunction } from 'express';
import { ErrorHttp } from '../errors.js';

export function manejarErrores(err: unknown, _req: Request, res: Response, _next: NextFunction) {
    if (err instanceof ErrorHttp) {
        res.status(err.status).json({ error: err.message });
        return;
    }
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
}