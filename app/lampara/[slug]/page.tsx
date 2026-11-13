import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { CajaCompra } from '@/components/CajaCompra';
import { FichaTecnica } from '@/components/FichaTecnica';
import { GaleriaProducto } from '@/components/GaleriaProducto';
import { JsonLd } from '@/components/JsonLd';
import { LlamadaFinal } from '@/components/LlamadaFinal';
import { Preguntas } from '@/components/Preguntas';
import { obtenerCatalogo, obtenerVariante } from '@/lib/catalogo';
import { jsonLdPreguntas } from '@/lib/preguntas';
import { jsonLdMigas, jsonLdProducto, obtenerFichaDeVariante, urlDeVariante } from '@/lib/seo';
import { precioARS } from '@/lib/site';

export const revalidate = 3600;

/** Todas las páginas se generan en el build: es lo que las hace indexables sin ejecutar JavaScript. */
export async function generateStaticParams() {
  const variantes = await obtenerCatalogo();
  return variantes.map((variante) => ({ slug: variante.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const variante = await obtenerVariante(params.slug);

  if (!variante) {
    return { title: 'Modelo no encontrado' };
  }

  const titulo = `${variante.producto} — ${variante.nombreCorto}`;

  return {
    title: titulo,
    description: variante.descripcion,
    alternates: {
      canonical: `/lampara/${variante.slug}`,
    },
    openGraph: {
      type: 'website',
      locale: 'es_AR',
      title: titulo,
      description: variante.descripcion,
      url: urlDeVariante(variante.slug),
      images: [{ url: variante.imagen, alt: `${titulo} — ${variante.patron}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: titulo,
      description: variante.descripcion,
      images: [variante.imagen],
    },
  };
}

export default async function PaginaVariante({ params }: { params: { slug: string } }) {
  const variante = await obtenerVariante(params.slug);

  if (!variante) {
    notFound();
  }

  const catalogo = await obtenerCatalogo();
  const otras = catalogo.filter((v) => v.slug !== variante.slug);
  const datosFicha = obtenerFichaDeVariante(variante);
  const esEspecial = variante.tipoProducto !== 'geometrica';
  const rutaSeccion = variante.esAstronauta
    ? '/#astronauta'
    : variante.esMiniLuna
      ? '/#mini-luna'
      : variante.esHalo
        ? '/#halo'
        : variante.esInfinity
          ? '/#infinity'
          : variante.esHive
            ? '/#hive'
            : variante.esMaceta
              ? '/#macetas'
              : variante.esLunar
                ? '/#lunar'
                : '/#modelos';

  return (
    <>
      <JsonLd datos={jsonLdProducto(variante)} />
      <JsonLd datos={jsonLdMigas(variante)} />
      <JsonLd datos={jsonLdPreguntas(variante)} />

      <article>
        <div className="contenedor py-10">
          <nav aria-label="Migas de pan" className="etiqueta">
            <Link href="/" className="transition-colors hover:text-hueso">
              Inicio
            </Link>
            <span className="mx-2 text-noche-borde">/</span>
            {esEspecial ? (
              <span className="text-hueso">{variante.producto}</span>
            ) : (
              <>
                <Link href={rutaSeccion} className="transition-colors hover:text-hueso">
                  {variante.producto}
                </Link>
                <span className="mx-2 text-noche-borde">/</span>
                <span className="text-hueso">{variante.nombreCorto}</span>
              </>
            )}
          </nav>
        </div>

        <section className="border-b border-noche-borde">
          <div className="contenedor grid gap-10 pb-20 md:pb-28 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            <div>
              <GaleriaProducto variante={variante} />

              <h1 className="mt-10 font-display text-4xl leading-tight tracking-tight text-hueso sm:text-5xl">
                {esEspecial ? variante.producto : `${variante.producto} — ${variante.nombreCorto}`}
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-relaxed text-humo">
                {variante.descripcion}
              </p>

              {variante.caracteristicas.length > 0 ? (
                <ul className="mt-6 max-w-xl space-y-2.5 border-y border-noche-borde py-5 text-sm text-hueso">
                  {variante.caracteristicas.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-luz" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              <p className="mt-5 text-sm text-humo">
                {datosFicha.dimensionesTexto} · {datosFicha.materialesCorto} ·{' '}
                {datosFicha.iluminacion}
              </p>
            </div>

            <CajaCompra variante={variante} />
          </div>
        </section>

        <FichaTecnica variante={variante} />

        <Preguntas variante={variante} />

        <section className="border-b border-noche-borde py-20 md:py-28">
          <div className="contenedor">
            <p className="etiqueta">También en el catálogo</p>
            <h2 className="mt-4 font-display text-3xl tracking-tight text-hueso">
              Otras lámparas y diseños disponibles.
            </h2>

            <ul className="mt-12 grid gap-px border border-noche-borde bg-noche-borde sm:grid-cols-2 lg:grid-cols-4">
              {otras.map((otra) => (
                <li key={otra.slug} className="bg-noche">
                  <Link href={`/lampara/${otra.slug}`} className="group block h-full">
                    <span className="relative block aspect-square overflow-hidden bg-noche-suave">
                      <Image
                        src={otra.imagen}
                        alt={`${otra.producto} — ${otra.patron}`}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        loading="eager"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </span>
                    <span className="block p-4">
                      <span className="block font-display text-sm text-hueso transition-colors group-hover:text-luz">
                        {otra.tipoProducto !== 'geometrica' ? otra.producto : otra.nombreCorto}
                      </span>
                      <span className="mt-1 block text-xs text-humo">
                        {precioARS(otra.precio)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <LlamadaFinal />
      </article>
    </>
  );
}
