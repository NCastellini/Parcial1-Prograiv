export type OpcionOrigen = {
  nombre: string;
  descripcion: string;
  precio?: number;
};

type Props = {
  opciones: OpcionOrigen[];
  valor: string | null;
  onCambio: (origen: string) => void;
};

export default function PasoOrigen({ opciones, valor, onCambio }: Props) {
  return (
    <fieldset className="mb-3">
      <legend className="h6">Origen</legend>
      {opciones.map((o) => (
        <div className="form-check" key={o.nombre}>
          <input className="form-check-input" type="radio" name="origen"
            id={`origen-${o.nombre}`} checked={valor === o.nombre}
            onChange={() => onCambio(o.nombre)} />
          <label className="form-check-label" htmlFor={`origen-${o.nombre}`}>
            <span className="fw-semibold">{o.nombre}</span>
            <small className="d-block text-muted">{o.descripcion}</small>
            {o.precio !== undefined && (
              <span className="d-block fw-bold">
                ${o.precio.toLocaleString('es-AR')}
              </span>
            )}
          </label>
        </div>
      ))}
    </fieldset>
  );
}