'use client';

import Image from 'next/image';
import { useState } from 'react';

import type { Variante } from '@/lib/catalogo';

export function GaleriaProducto({ variante }: { variante: Variante }) {
  const items =
    variante.galeria.length > 0
      ? variante.galeria
      : [{ tipo: 'imagen' as const, url: variante.imagen, etiqueta: variante.producto }];

  const [indiceActivo, setIndiceActivo] = useState(0);
  const activo = items[indiceActivo] ?? items[0];

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden border border-noche-borde bg-noche-suave">
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
          <Image
            key={activo.url}
            src={activo.url}
            alt={`${variante.producto} — ${activo.etiqueta}`}
            fill
            priority={indiceActivo === 0}
            sizes="(max-width: 1024px) 100vw, 55vw"
            className={indiceActivo === 0 ? 'object-cover' : 'object-contain'}
          />
        )}
      </div>

      {items.length > 1 ? (
        <ul
          aria-label="Galería de fotos y videos del producto"
          className={`mt-3 grid gap-2 ${
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
              <li key={item.url}>
                <button
                  type="button"
                  onClick={() => setIndiceActivo(idx)}
                  aria-label={`Ver ${item.etiqueta}`}
                  aria-current={seleccionado ? 'true' : undefined}
                  className={`group relative block aspect-square w-full overflow-hidden border bg-noche-suave transition ${
                    seleccionado
                      ? 'border-luz ring-1 ring-luz'
                      : 'border-noche-borde opacity-70 hover:border-humo hover:opacity-100'
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
                      alt={item.etiqueta}
                      fill
                      sizes="96px"
                      loading="eager"
                      className={
                        idx === 0
                          ? 'object-cover'
                          : !variante.esAstronauta && !variante.esMiniLuna && !variante.esMaceta
                            ? 'object-cover'
                            : 'object-contain'
                      }
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
