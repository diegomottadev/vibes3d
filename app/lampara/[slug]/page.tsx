import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { CajaCompra } from '@/components/CajaCompra';
import { FichaTecnica } from '@/components/FichaTecnica';
import { JsonLd } from '@/components/JsonLd';
import { LlamadaFinal } from '@/components/LlamadaFinal';
import { obtenerCatalogo, obtenerVariante } from '@/lib/catalogo';
import { ficha, jsonLdMigas, jsonLdProducto, urlDeVariante } from '@/lib/seo';

export const revalidate = 3600;

/** Las 6 páginas se generan en el build: es lo que las hace indexables sin ejecutar JavaScript. */
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

  const titulo = `${variante.producto} ${variante.nombreCorto}`;

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

  return (
    <>
      <JsonLd datos={jsonLdProducto(variante)} />
      <JsonLd datos={jsonLdMigas(variante)} />

      <article>
        <div className="contenedor py-10">
          <nav aria-label="Migas de pan" className="etiqueta">
            <Link href="/" className="transition-colors hover:text-hueso">
              Inicio
            </Link>
            <span className="mx-2 text-noche-borde">/</span>
            <Link href="/#modelos" className="transition-colors hover:text-hueso">
              Modelos
            </Link>
            <span className="mx-2 text-noche-borde">/</span>
            <span className="text-hueso">{variante.nombreCorto}</span>
          </nav>
        </div>

        <section className="border-b border-noche-borde">
          {/* Foto y descripción a la izquierda, caja de compra fija a la derecha. */}
          <div className="contenedor grid gap-10 pb-20 md:pb-28 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            <div>
              <div className="relative aspect-square w-full overflow-hidden border border-noche-borde bg-noche-suave">
                <Image
                  src={variante.imagen}
                  alt={`${variante.producto} con ${variante.patron}, encendida`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />
              </div>

              <h1 className="mt-10 font-display text-4xl leading-tight tracking-tight text-hueso sm:text-5xl">
                {variante.nombreCorto}
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-relaxed text-humo">
                {variante.descripcion}
              </p>

              <p className="mt-5 text-sm text-humo">
                {ficha.anchoMm} × {ficha.altoMm} mm · {ficha.materialesCorto} · {ficha.iluminacion}
              </p>
            </div>

            <CajaCompra variante={variante} />
          </div>
        </section>

        <FichaTecnica />

        <section className="border-b border-noche-borde py-20 md:py-28">
          <div className="contenedor">
            <p className="etiqueta">Los otros modelos</p>
            <h2 className="mt-4 font-display text-3xl tracking-tight text-hueso">
              Misma lámpara, otra trama.
            </h2>

            <ul className="mt-12 grid gap-px border border-noche-borde bg-noche-borde sm:grid-cols-2 lg:grid-cols-5">
              {otras.map((otra) => (
                <li key={otra.slug} className="bg-noche">
                  <Link href={`/lampara/${otra.slug}`} className="group block">
                    <span className="relative block aspect-square overflow-hidden bg-noche-suave">
                      <Image
                        src={otra.imagen}
                        alt={`Lámpara Geométrica con ${otra.patron}`}
                        fill
                        sizes="(max-width: 640px) 50vw, 20vw"
                        // Las cinco juntas pesan menos de 100 KB: esperar a que el navegador
                        // las descubra al hacer scroll solo deja huecos negros a la vista.
                        loading="eager"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </span>
                    <span className="block p-4 font-display text-sm text-hueso transition-colors group-hover:text-luz">
                      {otra.nombreCorto}
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
