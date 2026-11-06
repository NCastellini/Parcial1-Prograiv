import { useState } from 'react';
import type { Producto } from '../api/schemas';
import { buscarCafe, esCafe, type TipoBebida } from '../utils/buscarCafe';
import PasoBebida from './PasoBebida';
import PasoTamanio from './PasoTamanio';
import PasoOrigen from './PasoOrigen';

type SelectorCafeProps = {
  productos: Producto[];
  onAgregar: (producto: Producto) => void;
};

export default function SelectorCafe({ productos, onAgregar }: SelectorCafeProps) {
  const [tipo, setTipo] = useState<TipoBebida | null>(null);
  const [tamanio, setTamanio] = useState<string | null>(null);
  const [origen, setOrigen] = useState<string | null>(null);

  const cafes = productos.filter(esCafe);
  const tamanios = Array.from(new Set(cafes.map((c) => c.tamanio)));

  const opcionesOrigen = cafes
    .reduce<{ nombre: string; descripcion: string }[]>(
      (acc, c) =>
        acc.some((o) => o.nombre === c.variedad.nombre) ? acc : [...acc, c.variedad],
      [],
    )
    .map((o) => ({
      ...o,
      precio:
        tipo !== null && tamanio !== null
          ? buscarCafe({ tipo, tamanio, origen: o.nombre }, productos)?.precio
          : undefined,
    }));

  const productoElegido =
    tipo !== null && tamanio !== null && origen !== null
      ? buscarCafe({ tipo, tamanio, origen }, productos)
      : undefined;

  return (
    <section aria-label="Armá tu café">
      <PasoBebida valor={tipo} onCambio={setTipo} />
      <PasoTamanio opciones={tamanios} valor={tamanio} onCambio={setTamanio} />
      <PasoOrigen opciones={opcionesOrigen} valor={origen} onCambio={setOrigen} />

      <button
        type="button"
        className="btn btn-primary"
        disabled={!productoElegido}
        onClick={() => productoElegido && onAgregar(productoElegido)}
      >
        Agregar
      </button>
    </section>
  );
}