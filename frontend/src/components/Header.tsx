type HeaderProps = {
  mesa: number | null;
};

export default function Header({ mesa }: HeaderProps) {
  return (
    <header className="py-3 border-bottom">
      <div className="container">
        <h1 className="h4 mb-0">
          {mesa !== null
            ? `Mesa ${mesa}`
            : 'Para retirar en la barra'}
        </h1>
      </div>
    </header>
  );
}
