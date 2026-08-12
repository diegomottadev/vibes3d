import Image from 'next/image';
import Link from 'next/link';

import type { Variante } from '@/lib/catalogo';
import { BotonPedido } from './BotonPedido';

export function GrillaModelos({ variantes }: { variantes: Variante[] }) {
  return (
    <section id="modelos" className="border-b border-noche-borde py-20 md:py-28">
      <div className="contenedor">
        <p className="etiqueta">Los modelos</p>
        <h2 className="mt-4 max-w-2xl font-display text-4xl leading-tight tracking-tight text-hueso sm:text-5xl">
          Misma lámpara, seis tramas distintas.
        </h2>
        <p className="mt-4 max-w-xl leading-relaxed text-humo">
          Lo único que cambia es la pantalla, y con ella el dibujo que aparece al encenderla. Tocá
          cualquiera para ver el detalle.
        </p>

        <ul className="mt-14 grid gap-px border border-noche-borde bg-noche-borde sm:grid-cols-2 lg:grid-cols-3">
          {variantes.map((variante) => (
            <li key={variante.slug} className="group flex flex-col bg-noche">
              <Link
                href={`/lampara/${variante.slug}`}
                className="relative block aspect-square overflow-hidden bg-noche-suave"
              >
                <Image
                  src={variante.imagen}
                  alt={`Lámpara Geométrica con ${variante.patron}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                {variante.destacado ? (
                  <span className="absolute left-4 top-4 bg-luz px-2 py-1 font-display text-[10px] uppercase tracking-etiqueta text-noche">
                    Más pedido
                  </span>
                ) : null}
              </Link>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-xl text-hueso">
                  <Link href={`/lampara/${variante.slug}`} className="transition-colors hover:text-luz">
                    {variante.nombreCorto}
                  </Link>
                </h3>

                <p className="mt-3 flex-1 text-sm leading-relaxed text-humo">
                  {variante.descripcion}
                </p>

                {/* Una sola acción por tarjeta: la compra arranca en la página del modelo. */}
                <div className="mt-6">
                  <BotonPedido
                    href={`/lampara/${variante.slug}`}
                    etiqueta="Ver y pedir"
                    className="px-4 py-2"
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
