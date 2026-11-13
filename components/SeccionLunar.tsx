'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import type { Variante } from '@/lib/catalogo';
import { precioPorUnidad, precioTotal } from '@/lib/precios';
import { precioARS } from '@/lib/site';
import { BotonPedido } from './BotonPedido';

export function SeccionLunar({
  lunar,
  idSeccion = 'lunar',
  etiquetaDestaque = 'Nuevo producto',
  subtituloEtiqueta = 'Luz de ambiente · 18 cm',
}: {
  lunar: Variante;
  idSeccion?: string;
  etiquetaDestaque?: string;
  subtituloEtiqueta?: string;
}) {
  const items =
    lunar.galeria.length > 0
      ? lunar.galeria
      : [{ tipo: 'imagen' as const, url: lunar.imagen, etiqueta: lunar.producto }];
  const [indiceActivo, setIndiceActivo] = useState(0);
  const activo = items[indiceActivo] ?? items[0];

  const precioDos = precioTotal(lunar.precio, 2, lunar.producto);
  const precioTres = precioTotal(lunar.precio, 3, lunar.producto);
  const unitarioTres = precioPorUnidad(lunar.precio, 3, lunar.producto);

  return (
    <section
      id={idSeccion}
      className="relative overflow-hidden border-b border-noche-borde py-20 md:py-28"
    >
      <div className="halo right-0 top-1/2 h-[30rem] w-[30rem] -translate-y-1/2 translate-x-1/3 opacity-70" />

      <div className="contenedor relative">
        <div className="flex flex-wrap items-center gap-3">
          <span className="bg-luz px-2.5 py-1 font-display text-[10px] uppercase tracking-etiqueta text-noche">
            {etiquetaDestaque}
          </span>
          <p className="etiqueta">{subtituloEtiqueta}</p>
        </div>

        <div className="mt-8 grid items-start gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <div>
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-noche-borde bg-noche-suave">
              {activo.tipo === 'video' ? (
                <video
                  key={activo.url}
                  src={activo.url}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full object-contain"
                />
              ) : (
                <Link href={`/lampara/${lunar.slug}`} className="group relative block h-full w-full">
                  <Image
                    key={activo.url}
                    src={activo.url}
                    alt={lunar.producto}
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className={
                      indiceActivo === 0
                        ? 'object-cover transition duration-500 group-hover:scale-105'
                        : 'object-contain transition duration-500 group-hover:scale-105'
                    }
                  />
                </Link>
              )}
            </div>

            {items.length > 1 ? (
              <div
                className={`mt-3 grid gap-2.5 ${
                  items.length === 4
                    ? 'grid-cols-4'
                    : items.length === 5
                      ? 'grid-cols-5'
                      : 'grid-cols-3 sm:grid-cols-6'
                }`}
              >
                {items.map((item, idx) => {
                  const seleccionado = idx === indiceActivo;
                  return (
                    <button
                      key={item.url}
                      type="button"
                      onClick={() => setIndiceActivo(idx)}
                      aria-label={`Ver ${item.etiqueta} de ${lunar.producto}`}
                      className={`group relative aspect-square overflow-hidden border bg-noche-suave transition ${
                        seleccionado
                          ? 'border-luz ring-1 ring-luz'
                          : 'border-noche-borde opacity-75 hover:border-humo hover:opacity-100'
                      }`}
                    >
                      {item.tipo === 'video' ? (
                        <>
                          <video
                            src={item.url}
                            muted
                            playsInline
                            preload="metadata"
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute inset-0 flex items-center justify-center bg-noche/50">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-luz text-noche">
                              <i className="pi pi-play text-[10px]" aria-hidden="true" />
                            </span>
                          </span>
                        </>
                      ) : (
                        <Image
                          src={item.url}
                          alt={`${lunar.producto} — ${item.etiqueta}`}
                          fill
                          sizes="(max-width: 768px) 20vw, 12vw"
                          className={
                            idx === 0
                              ? 'object-cover'
                              : !lunar.esAstronauta && !lunar.esMiniLuna && !lunar.esMaceta
                                ? 'object-cover'
                                : 'object-contain'
                          }
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col justify-center">
            <h2 className="font-display text-4xl leading-tight tracking-tight text-hueso sm:text-5xl">
              {lunar.producto}
              <span className="text-luz">.</span>
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-humo">{lunar.descripcion}</p>

            {lunar.caracteristicas.length > 0 ? (
              <ul className="mt-6 space-y-2.5 border-y border-noche-borde py-5 text-sm text-hueso">
                {lunar.caracteristicas.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-luz" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-6">
              <p className="font-display text-3xl text-hueso">
                {precioARS(lunar.precio)}
                <span className="ml-3 align-middle text-sm font-normal text-humo">por unidad</span>
              </p>
              <p className="mt-1.5 text-sm text-luz">
                Promo por cantidad: 2 por {precioARS(precioDos)} · 3 por {precioARS(precioTres)} (3
                o más a {precioARS(unitarioTres)} c/u)
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <BotonPedido href={`/lampara/${lunar.slug}`} etiqueta="Pedir ahora" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
