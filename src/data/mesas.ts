// Se crea un arreglo con 10 entradas que representan 10 mesas físicas en el local
// En caso de querer cambiar la cantidad de mesas solo debe modificarse la longitud del arreglo

export const mesas = Array.from({ length: 10 }, (_, i) => ({ id: i + 1 }));