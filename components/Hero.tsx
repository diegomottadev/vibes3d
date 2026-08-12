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
              al que compra le importa cómo se ve encendida, no la impresora.
              Ojo con el copy de toda la página: la lámpara NO proyecta su trama sobre la pared.
              La trama es la pantalla misma, y se lee cuando la luz la atraviesa desde adentro.
              La localidad no se muestra acá; sigue en el pie y en el JSON-LD de LocalBusiness,
              que es lo que lee Google para el SEO local. */}
          <h1 className="font-display text-5xl leading-[0.95] tracking-tight text-hueso sm:text-6xl lg:text-7xl">
            Lámpara
            <br />
            Geométrica<span className="text-luz">.</span>
            <span className="mt-4 block font-display text-xl tracking-tight text-humo sm:text-2xl">
              Luz cálida, lista para enchufar.
            </span>
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-humo">
            Lámpara de mesa con trípode para el escritorio, la mesa de luz o cualquier rincón que
            pida luz cálida. {cantidadModelos} diseños de pantalla: elegís el que mejor va con tu
            decoración. Incluye cable transparente de 1,5 m con interruptor y enchufe de 220 V —
            la enchufás y ya está.
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
