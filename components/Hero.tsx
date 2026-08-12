import Image from 'next/image';

import type { Variante } from '@/lib/catalogo';
import { precioARS } from '@/lib/site';
import { BotonPedido } from './BotonPedido';

export function Hero({ destacada, cantidadModelos }: { destacada: Variante; cantidadModelos: number }) {
  return (
    <section className="relative overflow-hidden border-b border-noche-borde">
      <div className="halo left-1/2 top-0 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/3 animate-brillo-lento" />

      <div className="contenedor relative grid items-center gap-12 py-20 md:grid-cols-2 md:py-28">
        <div>
          {/* El subtítulo del h1 habla de lo que hace la lámpara, no de cómo está fabricada:
              al que compra le importa la luz sobre la pared, no la impresora.
              La localidad no se muestra acá; sigue en el pie y en el JSON-LD de LocalBusiness,
              que es lo que lee Google para el SEO local. */}
          <h1 className="font-display text-5xl leading-[0.95] tracking-tight text-hueso sm:text-6xl lg:text-7xl">
            Lámpara
            <br />
            Geométrica<span className="text-luz">.</span>
            <span className="mt-4 block font-display text-xl tracking-tight text-humo sm:text-2xl">
              Luz que dibuja.
            </span>
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-humo">
            Una lámpara de mesa que proyecta su propia trama sobre la pared. {cantidadModelos}{' '}
            diseños de pantalla, el mismo precio: elegís por cómo cae la luz, no por cuánto sale.
          </p>

          <div className="mt-10">
            <BotonPedido etiqueta={`Ver los ${cantidadModelos} modelos`} />
          </div>

          <p className="mt-8 font-display text-2xl text-hueso">
            {precioARS(destacada.precio)}
            <span className="ml-3 align-middle text-sm font-normal text-humo">
              cualquiera de los {cantidadModelos} modelos
            </span>
          </p>
        </div>

        <div className="relative aspect-[4/5] w-full overflow-hidden border border-noche-borde bg-noche-suave">
          <Image
            src={destacada.imagen}
            alt={`Lámpara Geométrica con ${destacada.patron} encendida sobre una mesa`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
