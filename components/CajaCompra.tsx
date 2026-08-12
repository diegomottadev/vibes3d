'use client';

import Link from 'next/link';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { useState } from 'react';

import type { Variante } from '@/lib/catalogo';
import { CANTIDAD_MAYORISTA, precioPorUnidad, precioTotal } from '@/lib/precios';
import { precioARS } from '@/lib/site';
import { usePedido } from './PedidoProvider';

const OPCIONES_CANTIDAD = Array.from({ length: 12 }, (_, i) => ({
  label: i === 0 ? '1 unidad' : `${i + 1} unidades`,
  value: i + 1,
}));

/**
 * La caja de compra: precio, cantidad y acción, todo junto y sin scroll.
 * En pantallas grandes queda fija mientras se recorre la página, como en Mercado Libre.
 */
export function CajaCompra({ variante }: { variante: Variante }) {
  const { agregar, abrirPedido, unidades } = usePedido();
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);

  const totalDeEsteItem = precioTotal(variante.precio, cantidad);
  const unitario = precioPorUnidad(variante.precio, cantidad);
  const hayDescuento = unitario < variante.precio;

  function alAgregar() {
    agregar(variante.slug, cantidad);
    setAgregado(true);
    window.setTimeout(() => setAgregado(false), 2500);
  }

  return (
    <aside className="lg:sticky lg:top-24">
      <div className="border border-noche-borde bg-noche-suave p-6">
        <p className="etiqueta">{variante.producto}</p>
        <h2 className="mt-2 font-display text-2xl text-hueso">{variante.nombreCorto}</h2>

        <p className="mt-5 font-display text-4xl text-hueso">{precioARS(variante.precio)}</p>
        <p className="mt-1 text-sm text-humo">por unidad</p>

        <div className="mt-6">
          <label className="etiqueta mb-2 block" htmlFor={`cantidad-${variante.slug}`}>
            Cantidad
          </label>
          <Dropdown
            inputId={`cantidad-${variante.slug}`}
            value={cantidad}
            options={OPCIONES_CANTIDAD}
            onChange={(e) => setCantidad(e.value)}
            className="w-full"
          />

          {hayDescuento ? (
            <p className="mt-3 text-sm text-luz">
              {precioARS(unitario)} cada una · total {precioARS(totalDeEsteItem)}
            </p>
          ) : (
            <p className="mt-3 text-sm text-humo">
              Llevando 2 baja a {precioARS(precioPorUnidad(variante.precio, 2))} cada una, y desde{' '}
              {CANTIDAD_MAYORISTA} a {precioARS(precioPorUnidad(variante.precio, CANTIDAD_MAYORISTA))}.
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Button
            label="Pedir ahora"
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

          {/* Tercera acción, deliberadamente de menor peso visual: después de agregar algo,
              lo natural es querer volver a la grilla y sumar otra trama. */}
          <Link
            href="/#modelos"
            className="text-center font-display text-xs uppercase tracking-etiqueta text-humo underline underline-offset-4 transition-colors hover:text-luz"
          >
            Seguir eligiendo modelos
          </Link>
        </div>

        {/* El aviso solo aparece cuando ya hay algo cargado: si no, es ruido. */}
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
          Se imprime a pedido. El envío se cotiza según tu localidad y lo coordinamos por WhatsApp.
        </p>
      </div>
    </aside>
  );
}
