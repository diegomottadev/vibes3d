import { ficha } from '@/lib/seo';

const filas = [
  { dato: 'Materiales', valor: ficha.materiales },
  { dato: 'Dimensiones', valor: `${ficha.anchoMm} mm × ${ficha.altoMm} mm` },
  { dato: 'Iluminación', valor: ficha.iluminacion },
  { dato: 'Conexión', valor: ficha.cable },
  { dato: 'Soporte', valor: 'Trípode incluido' },
  { dato: 'Disponibilidad', valor: 'Stock permanente de los seis modelos' },
];

export function FichaTecnica() {
  return (
    <section id="ficha" className="border-b border-noche-borde py-20 md:py-28">
      <div className="contenedor grid gap-12 md:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="etiqueta">Ficha técnica</p>
          <h2 className="mt-4 font-display text-4xl leading-tight tracking-tight text-hueso">
            Lo que viene en la caja.
          </h2>
        </div>

        <dl className="divide-y divide-noche-borde border-y border-noche-borde">
          {filas.map((fila) => (
            <div key={fila.dato} className="grid gap-1 py-5 sm:grid-cols-[10rem_1fr] sm:gap-6">
              <dt className="etiqueta">{fila.dato}</dt>
              <dd className="leading-relaxed text-hueso">{fila.valor}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
