'use client';

import Link from 'next/link';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { useMemo, useState } from 'react';

import type { Variante } from '@/lib/catalogo';
import {
  ahorro,
  CANTIDAD_MAYORISTA,
  CANTIDAD_PACK_LUNAR,
  precioPorUnidad,
  precioTotal,
} from '@/lib/precios';
import { precioARS } from '@/lib/site';
import { usePedido } from './PedidoProvider';

export function CajaCompra({ variante }: { variante: Variante }) {
  const { agregar, abrirPedido, unidades } = usePedido();
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);

  const esPackTres = variante.tipoProducto !== 'geometrica';
  const totalDeEsteItem = precioTotal(variante.precio, cantidad, variante.producto);
  const unitario = precioPorUnidad(variante.precio, cantidad, variante.producto);
  const descuento = ahorro(variante.precio, cantidad, variante.producto);
  const hayDescuento = descuento > 0;
  const sinDescuento = variante.precio * cantidad;
  const porcentajeOff = Math.round((descuento / sinDescuento) * 100);

  const opcionesCantidad = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const cant = i + 1;
        const tot = precioTotal(variante.precio, cant, variante.producto);
        const unit = precioPorUnidad(variante.precio, cant, variante.producto);
        const etiquetaCant = cant === 1 ? '1 unidad' : `${cant} unidades`;
        return {
          value: cant,
          label:
            cant === 1
              ? `${etiquetaCant} (${precioARS(tot)})`
              : `${etiquetaCant} — ${precioARS(tot)} (${precioARS(unit)} c/u)`,
        };
      }),
    [variante.precio, variante.producto],
  );

  const escalonesPromo = useMemo(() => {
    const cantidades = esPackTres ? [1, 2, CANTIDAD_PACK_LUNAR] : [1, 2, 3, CANTIDAD_MAYORISTA];
    return cantidades.map((cant) => ({
      cantidad: cant,
      etiqueta:
        cant === 1
          ? '1 u.'
          : cant === CANTIDAD_PACK_LUNAR && esPackTres
            ? '3 o más'
            : cant === CANTIDAD_MAYORISTA && !esPackTres
              ? '6 o más'
              : `${cant} u.`,
      unitario: precioPorUnidad(variante.precio, cant, variante.producto),
      total: precioTotal(variante.precio, cant, variante.producto),
    }));
  }, [esPackTres, variante.precio, variante.producto]);

  function alAgregar() {
    agregar(variante.slug, cantidad);
    setAgregado(true);
    window.setTimeout(() => setAgregado(false), 2500);
  }

  return (
    <aside className="lg:sticky lg:top-24">
      <div className="border border-noche-borde bg-noche-suave p-6">
        {variante.tipoProducto === 'geometrica' ? (
          <p className="etiqueta">Pantalla {variante.nombreCorto}</p>
        ) : null}
        <h2
          className={`font-display text-2xl text-hueso ${
            variante.tipoProducto === 'geometrica' ? 'mt-2' : ''
          }`}
        >
          {variante.producto}
        </h2>

        <div className="mt-5">
          {hayDescuento ? (
            <p className="text-sm text-humo line-through">{precioARS(variante.precio)} c/u</p>
          ) : null}

          <div className="flex flex-wrap items-baseline gap-3">
            <p className="font-display text-4xl text-hueso">{precioARS(unitario)}</p>
            <span className="text-sm text-humo">cada una</span>
            {hayDescuento ? (
              <span className="bg-luz/15 px-2 py-0.5 font-display text-xs text-luz">
                {porcentajeOff}% OFF
              </span>
            ) : null}
          </div>

          {cantidad > 1 ? (
            <div className="mt-3 flex items-baseline justify-between border-y border-noche-borde py-2.5">
              <span className="text-sm text-humo">
                Total por {cantidad} {cantidad === 1 ? 'unidad' : 'unidades'}
              </span>
              <div className="text-right">
                <span className="font-display text-xl text-luz">{precioARS(totalDeEsteItem)}</span>
                {hayDescuento ? (
                  <span className="block text-xs text-humo">Ahorrás {precioARS(descuento)}</span>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-5">
          <span className="etiqueta mb-2 block">Precios por cantidad</span>
          <div
            className={`grid gap-2 ${
              escalonesPromo.length === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'
            }`}
          >
            {escalonesPromo.map((esc) => {
              const activo =
                esc.cantidad === 1
                  ? cantidad === 1
                  : esc.cantidad === CANTIDAD_PACK_LUNAR && esPackTres
                    ? cantidad >= CANTIDAD_PACK_LUNAR
                    : esc.cantidad === CANTIDAD_MAYORISTA && !esPackTres
                      ? cantidad >= CANTIDAD_MAYORISTA
                      : cantidad === esc.cantidad;

              return (
                <button
                  key={esc.cantidad}
                  type="button"
                  onClick={() => setCantidad(esc.cantidad)}
                  className={`flex flex-col items-start border p-2.5 text-left transition ${
                    activo
                      ? 'border-luz bg-luz/10 text-hueso'
                      : 'border-noche-borde bg-noche text-humo hover:border-humo hover:text-hueso'
                  }`}
                >
                  <span className="font-display text-xs uppercase tracking-etiqueta text-luz">
                    {esc.etiqueta}
                  </span>
                  <span className="mt-1 font-display text-sm text-hueso">
                    {precioARS(esc.unitario)}
                  </span>
                  <span className="text-[11px] text-humo">c/u</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5">
          <label className="etiqueta mb-2 block" htmlFor={`cantidad-${variante.slug}`}>
            Cantidad
          </label>
          <Dropdown
            inputId={`cantidad-${variante.slug}`}
            value={cantidad}
            options={opcionesCantidad}
            onChange={(e) => setCantidad(e.value)}
            className="w-full"
          />
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Button
            label={
              cantidad > 1
                ? `Pedir ${cantidad} por ${precioARS(totalDeEsteItem)}`
                : 'Pedir ahora'
            }
            icon="pi pi-whatsapp"
            onClick={() => abrirPedido(variante.slug, cantidad)}
            className="justify-center"
          />
          <button
            type="button"
            onClick={alAgregar}
            className="inline-flex items-center justify-center gap-2 border border-noche-borde px-6 py-3 font-display text-xs uppercase tracking-etiqueta text-hueso transition-colors hover:border-luz hover:text-luz"
          >
            {agregado ? (
              <>
                <i className="pi pi-check text-xs text-luz" aria-hidden="true" />
                Agregado
              </>
            ) : (
              'Agregar al pedido'
            )}
          </button>

          <Link
            href="/"
            className="text-center font-display text-xs uppercase tracking-etiqueta text-humo underline underline-offset-4 transition-colors hover:text-luz"
          >
            Seguir viendo catálogo
          </Link>
        </div>

        {unidades > 0 ? (
          <p className="mt-4 border-t border-noche-borde pt-4 text-sm text-humo">
            Tu pedido lleva {unidades} {unidades === 1 ? 'lámpara' : 'lámparas'}.{' '}
            <button
              type="button"
              onClick={() => abrirPedido()}
              className="text-luz underline underline-offset-4 transition-opacity hover:opacity-80"
            >
              Ver el pedido
            </button>
          </p>
        ) : null}

        <p className="mt-4 text-xs leading-relaxed text-humo">
          Trabajamos con stock disponible y por encargo (despacho de 2 a 7 días hábiles). El envío
          es por Correo Argentino a domicilio o sucursal y lo coordinamos por WhatsApp.
        </p>
      </div>
    </aside>
  );
}
