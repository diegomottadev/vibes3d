import Link from 'next/link';

export default function NoEncontrado() {
  return (
    <section className="contenedor flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="etiqueta">Error 404</p>
      <h1 className="mt-4 font-display text-4xl tracking-tight text-hueso">
        Ese modelo no existe.
      </h1>
      <p className="mt-4 max-w-sm leading-relaxed text-humo">
        Puede que hayas seguido un link viejo. Los seis modelos disponibles están en la portada.
      </p>
      <Link
        href="/#modelos"
        className="mt-10 inline-flex items-center gap-2 bg-luz px-6 py-3 font-display text-xs uppercase tracking-etiqueta text-noche transition-colors hover:bg-luz-calida"
      >
        Ver los modelos
      </Link>
    </section>
  );
}
