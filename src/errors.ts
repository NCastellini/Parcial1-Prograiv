// Clase para lanzar un error de HTTP con formato {código: mensaje}

export class ErrorHttp extends Error {
    constructor(public status: number, message: string) {
        super(message);
    }
}