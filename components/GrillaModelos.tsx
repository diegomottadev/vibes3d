'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import type { Variante } from '@/lib/catalogo';
import { CANTIDAD_MAYORISTA, precioPorUnidad, precioTotal } from '@/lib/precios';
import { precioARS } from '@/lib/site';
import { BotonPedido } from './BotonPedido';

const CARACTERISTICAS_GEOMETRICA = [
  'Dimensiones: 13 cm de ancho × 23 cm de alto (con trípode incluido)',
  'Luz LED 220 V de tono cálido incluida',
  'Cable armado de 1,5 m con interruptor y ficha macho',
  '6 diseños de pantalla disponibles al mismo precio',
  'Lista para usar. Solo enchufar y disfrutar.',
];

export function GrillaModelos({ variantes }: { variantes: Variante[] }) {
  const indiceDestacada = Math.max(
    0,
    variantes.findIndex((v) => v.destacado),
  );
  const [indiceActivo, setIndiceActivo] = useState(indiceDestacada);
  const activa = variantes[indiceActivo] ?? variantes[0];

  if (!activa) return null;

  const precioDos = precioTotal(activa.precio, 2, activa.producto);
  const precioTres = precioTotal(activa.precio, 3, activa.producto);
  const unitarioMayorista = precioPorUnidad(activa.precio, CANTIDAD_MAYORISTA, activa.producto);

  return (
    <section
      id="modelos"
      className="relative overflow-hidden border-b border-noche-borde py-20 md:py-28"
    >
      <div className="halo left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/3 animate-brillo-lento" />

      <div className="contenedor relative">
        <div className="flex flex-wrap items-center gap-3">
          <span className="bg-luz px-2.5 py-1 font-display text-[10px] uppercase tracking-etiqueta text-noche">
            Más pedido
          </span>
          <p className="etiqueta">{variantes.length} diseños de pantalla · 13 × 23 cm</p>
        </div>

        <div className="mt-8 grid items-start gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <div>
            <Link
              href={`/lampara/${activa.slug}`}
              className="group relative block aspect-[4/3] w-full overflow-hidden border border-noche-borde bg-noche-suave"
            >
              <Image
                key={activa.imagen}
                src={activa.imagen}
                alt={`${activa.producto} — ${activa.nombreCorto}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            </Link>

            <ul
              aria-label="Diseños de pantalla disponibles"
              className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6"
            >
              {variantes.map((variante, idx) => {
                const seleccionado = idx === indiceActivo;
                return (
                  <li key={variante.slug}>
                    <button
                      type="button"
                      onClick={() => setIndiceActivo(idx)}
                      aria-label={`Ver pantalla ${variante.nombreCorto}`}
                      aria-current={seleccionado ? 'true' : undefined}
                      className={`group relative block aspect-square w-full overflow-hidden border bg-noche-suave transition ${
                        seleccionado
                          ? 'border-luz ring-1 ring-luz'
                          : 'border-noche-borde opacity-75 hover:border-humo hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={variante.imagen}
                        alt={`${variante.producto} — ${variante.nombreCorto}`}
                        fill
                        sizes="(max-width: 640px) 33vw, 10vw"
                        loading="eager"
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="font-display text-4xl leading-tight tracking-tight text-hueso sm:text-5xl">
              {activa.producto}
              <span className="text-luz">.</span>
              <span className="mt-2 block font-display text-xl text-humo sm:text-2xl">
                Pantalla {activa.nombreCorto}
              </span>
            </h1>

            {/* Selector rápido de las 6 tramas por nombre */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {variantes.map((v, idx) => {
                const seleccionado = idx === indiceActivo;
                return (
                  <button
                    key={v.slug}
                    type="button"
                    onClick={() => setIndiceActivo(idx)}
                    className={`border px-2.5 py-1 font-display text-[11px] uppercase tracking-etiqueta transition ${
                      seleccionado
                        ? 'border-luz bg-luz/15 text-luz'
                        : 'border-noche-borde bg-noche-suave text-humo hover:border-humo hover:text-hueso'
                    }`}
                  >
                    {v.nombreCorto}
                  </button>
                );
              })}
            </div>

            <p className="mt-5 text-lg leading-relaxed text-humo">{activa.descripcion}</p>

            <ul className="mt-6 space-y-2.5 border-y border-noche-borde py-5 text-sm text-hueso">
              {CARACTERISTICAS_GEOMETRICA.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-luz" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <p className="font-display text-3xl text-hueso">
                {precioARS(activa.precio)}
                <span className="ml-3 align-middle text-sm font-normal text-humo">
                  por unidad (cualquiera de los {variantes.length} modelos)
                </span>
              </p>
              <p className="mt-1.5 text-sm text-luz">
                Promo por cantidad: 2 por {precioARS(precioDos)} · 3 por {precioARS(precioTres)} (
                {CANTIDAD_MAYORISTA} o más a {precioARS(unitarioMayorista)} c/u)
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <BotonPedido
                href={`/lampara/${activa.slug}`}
                etiqueta="Pedir ahora"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
