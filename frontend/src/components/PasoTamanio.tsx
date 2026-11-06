type Props = {
  opciones: string[];
  valor: string | null;
  onCambio: (tamanio: string) => void;
};

export default function PasoTamanio({ opciones, valor, onCambio }: Props) {
  return (
    <fieldset className="mb-3">
      <legend className="h6">Tamaño</legend>
      {opciones.map((t) => (
        <div className="form-check" key={t}>
          <input className="form-check-input" type="radio" name="tamanio"
            id={`tamanio-${t}`} checked={valor === t} onChange={() => onCambio(t)} />
          <label className="form-check-label" htmlFor={`tamanio-${t}`}>{t}</label>
        </div>
      ))}
    </fieldset>
  );
}