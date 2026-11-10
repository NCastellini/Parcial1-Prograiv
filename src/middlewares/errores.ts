import { Request, Response, NextFunction } from 'express';
import { ErrorHttp } from '../errors.js';

export function manejarErrores(err: unknown, _req: Request, res: Response, _next: NextFunction) {
    if (err instanceof ErrorHttp) {
        res.status(err.status).json({ error: err.message });
        return;
    }
    if ((err as any)?.type === 'entity.parse.failed') {
        res.status(400).json({ error: 'El body no es un JSON válido' });
        return;
    }
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
}

export function rutaNoEncontrada(_req: Request, res: Response) {
    res.status(404).json({ error: 'Ruta no encontrada' });
}