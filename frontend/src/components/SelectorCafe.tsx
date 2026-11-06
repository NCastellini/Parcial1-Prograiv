import { useState } from 'react';
import type { Producto } from '../api/schemas';
import { buscarCafe, esCafe, type TipoBebida } from '../utils/buscarCafe';

type SelectorCafeProps = {
  productos: Producto[];
  onAgregar: (producto: Producto) => void;
};

const bebidas = [
  { valor: 'expreso', etiqueta: 'Expreso' },
  { valor: 'filtrado', etiqueta: 'Filtrado' },
] as const;

export default function SelectorCafe({ productos }: SelectorCafeProps) {
  const cafes = productos.filter(esCafe);
  const tamanios = Array.from(new Set(cafes.map((c) => c.tamanio)));
  const origenes = cafes.reduce<{ nombre: string; descripcion: string }[]>(
    (acc, c) =>
      acc.some((o) => o.nombre === c.variedad.nombre) ? acc : [...acc, c.variedad],
    [],
  );

  const [tipo, setTipo] = useState<TipoBebida | null>(null);
  const [tamanio, setTamanio] = useState<string | null>(null);
  const [origen, setOrigen] = useState<string | null>(null);

  const productoElegido =
    tipo !== null && tamanio !== null && origen !== null
      ? buscarCafe({ tipo, tamanio, origen }, productos)
      : undefined;

  return (
    <section aria-label="Armá tu café">
      <fieldset className="mb-3">
        <legend className="h6">Bebida</legend>
        {bebidas.map((b) => (
          <div className="form-check" key={b.valor}>
            <input
              className="form-check-input"
              type="radio"
              name="bebida"
              id={`bebida-${b.valor}`}
              checked={tipo === b.valor}
              onChange={() => setTipo(b.valor)}
            />
            <label className="form-check-label" htmlFor={`bebida-${b.valor}`}>
              {b.etiqueta}
            </label>
          </div>
        ))}
      </fieldset>

      <fieldset className="mb-3">
        <legend className="h6">Tamaño</legend>
        {tamanios.map((t) => (
          <div className="form-check" key={t}>
            <input
              className="form-check-input"
              type="radio"
              name="tamanio"
              id={`tamanio-${t}`}
              checked={tamanio === t}
              onChange={() => setTamanio(t)}
            />
            <label className="form-check-label" htmlFor={`tamanio-${t}`}>
              {t}
            </label>
          </div>
        ))}
      </fieldset>

      <fieldset className="mb-3">
        <legend className="h6">Origen</legend>
        {origenes.map((o) => (
          <div className="form-check" key={o.nombre}>
            <input
              className="form-check-input"
              type="radio"
              name="origen"
              id={`origen-${o.nombre}`}
              checked={origen === o.nombre}
              onChange={() => setOrigen(o.nombre)}
            />
            <label className="form-check-label" htmlFor={`origen-${o.nombre}`}>
              {o.nombre}
            </label>
          </div>
        ))}
      </fieldset>

      <button type="button" className="btn btn-primary" disabled={!productoElegido}>
        Agregar
      </button>
    </section>
  );
}