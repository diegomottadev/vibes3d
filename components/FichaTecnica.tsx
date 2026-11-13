import type { Variante } from '@/lib/catalogo';
import { obtenerFichaDeVariante } from '@/lib/seo';

export function FichaTecnica({ variante }: { variante?: Variante }) {
  const datos = obtenerFichaDeVariante(variante);
  const esMaceta = Boolean(variante?.esMaceta || variante?.tipoProducto === 'maceta');

  const filas = [
    { dato: 'Materiales', valor: datos.materiales },
    { dato: 'Dimensiones', valor: datos.dimensionesTexto },
    { dato: esMaceta ? 'Colores' : 'Iluminación', valor: datos.iluminacion },
    { dato: esMaceta ? 'Diseño' : 'Conexión', valor: datos.cable },
    { dato: 'Soporte', valor: datos.soporte },
    { dato: 'Disponibilidad', valor: datos.disponibilidad },
  ];

  return (
    <section id="ficha" className="border-b border-noche-borde py-20 md:py-28">
      <div className="contenedor grid gap-12 md:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="etiqueta">
            Ficha técnica {variante ? `· ${variante.producto}` : '· Lámpara Geométrica'}
          </p>
          <h2 className="mt-4 font-display text-4xl leading-tight tracking-tight text-hueso">
            {esMaceta ? 'Detalles del producto.' : 'Lo que viene en la caja.'}
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
