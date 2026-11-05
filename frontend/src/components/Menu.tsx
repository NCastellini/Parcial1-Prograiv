import { useMenu } from '../hooks/useMenu';

export default function Menu() {
  const { estado } = useMenu();

  if (estado.estado === 'cargando') {
    return (
      <section aria-label="Menú">
        <div className="d-flex align-items-center gap-2" role="status">
          <span
            className="spinner-border spinner-border-sm"
            aria-hidden="true"
          />
          <span>Cargando menú...</span>
        </div>
      </section>
    );
  }

  return null;
}
