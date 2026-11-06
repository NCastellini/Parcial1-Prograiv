import type { TipoBebida } from '../utils/buscarCafe';

const bebidas = [
  { valor: 'expreso', etiqueta: 'Expreso' },
  { valor: 'filtrado', etiqueta: 'Filtrado' },
] as const;

type Props = { valor: TipoBebida | null; onCambio: (tipo: TipoBebida) => void };

export default function PasoBebida({ valor, onCambio }: Props) {
  return (
    <fieldset className="mb-3">
      <legend className="h6">Bebida</legend>
      {bebidas.map((b) => (
        <div className="form-check" key={b.valor}>
          <input className="form-check-input" type="radio" name="bebida"
            id={`bebida-${b.valor}`} checked={valor === b.valor}
            onChange={() => onCambio(b.valor)} />
          <label className="form-check-label" htmlFor={`bebida-${b.valor}`}>
            {b.etiqueta}
          </label>
        </div>
      ))}
    </fieldset>
  );
}