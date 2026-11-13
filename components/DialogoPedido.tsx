'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { useMemo, useState } from 'react';

import { precioPorUnidad, precioTotal } from '@/lib/precios';
import { filtros, LARGOS, limpiarParaMensaje } from '@/lib/sanitizar';
import { precioARS } from '@/lib/site';
import { urlWhatsApp, type DatosEnvio } from '@/lib/whatsapp';
import { usePedido } from './PedidoProvider';

const DATOS_VACIOS: DatosEnvio = {
  nombreCompleto: '',
  dni: '',
  telefono: '',
  direccion: '',
  localidad: '',
  codigoPostal: '',
  referencia: '',
};

const OBLIGATORIOS = [
  'nombreCompleto',
  'dni',
  'telefono',
  'direccion',
  'localidad',
  'codigoPostal',
] as const satisfies readonly (keyof DatosEnvio)[];

export function DialogoPedido({ abierto, alCerrar }: { abierto: boolean; alCerrar: () => void }) {
  const { variantes, lineas, unidades, total, descuento, cambiarCantidad, quitar, vaciar } =
    usePedido();
  const [datos, setDatos] = useState<DatosEnvio>(DATOS_VACIOS);
  const [intentoEnviar, setIntentoEnviar] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const vacio = lineas.length === 0;
  const faltantes = OBLIGATORIOS.filter((campo) => datos[campo].trim().length === 0);

  // Tres accesos directos (uno por línea de producto) para cuando el carrito queda vacío
  const sugeridosCatalogo = useMemo(() => {
    const astronauta = variantes.find((v) => v.esAstronauta);
    const lunar = variantes.find((v) => v.esLunar);
    const geometrica = variantes.find((v) => v.tipoProducto === 'geometrica' && v.destacado) ??
      variantes.find((v) => v.tipoProducto === 'geometrica');

    return [
      astronauta
        ? {
            titulo: astronauta.producto,
            subtitulo: '33 cm de altura',
            precio: astronauta.precio,
            imagen: astronauta.imagen,
            href: `/lampara/${astronauta.slug}`,
          }
        : null,
      lunar
        ? {
            titulo: lunar.producto,
            subtitulo: '18 cm de diámetro',
            precio: lunar.precio,
            imagen: lunar.imagen,
            href: `/lampara/${lunar.slug}`,
          }
        : null,
      geometrica
        ? {
            titulo: geometrica.producto,
            subtitulo: '6 diseños de pantalla',
            precio: geometrica.precio,
            imagen: geometrica.imagen,
            href: '/#modelos',
          }
        : null,
    ].filter((x): x is NonNullable<typeof x> => x !== null);
  }, [variantes]);

  function cerrar() {
    setEnviado(false);
    alCerrar();
  }

  function actualizar(campo: keyof DatosEnvio, valor: string) {
    setDatos((previos) => ({ ...previos, [campo]: filtros[campo](valor) }));
  }

  function invalido(campo: keyof DatosEnvio): boolean {
    return intentoEnviar && datos[campo].trim().length === 0;
  }

  function enviar() {
    setIntentoEnviar(true);
    if (vacio || faltantes.length > 0) return;

    const limpios = Object.fromEntries(
      Object.entries(datos).map(([campo, valor]) => [campo, limpiarParaMensaje(valor)]),
    ) as DatosEnvio;

    window.open(
      urlWhatsApp({ lineas, unidades, total, datos: limpios }),
      '_blank',
      'noopener,noreferrer',
    );

    vaciar();
    setIntentoEnviar(false);
    setEnviado(true);
  }

  const pie = vacio || enviado ? null : (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="text-left">
        <span className="etiqueta block">Total</span>
        <span className="font-display text-3xl text-hueso">{precioARS(total)}</span>
        <span className="mt-1 block text-sm text-humo">
          {unidades} {unidades === 1 ? 'lámpara' : 'lámparas'}
          {descuento > 0 ? (
            <span className="ml-2 text-luz">Te ahorrás {precioARS(descuento)}</span>
          ) : null}
        </span>
      </div>

      <Button
        label="Enviar pedido por WhatsApp"
        icon="pi pi-whatsapp"
        onClick={enviar}
        className="justify-center"
      />
    </div>
  );

  return (
    <Dialog
      visible={abierto}
      onHide={cerrar}
      header={enviado ? 'Pedido enviado' : 'Tu pedido'}
      draggable={false}
      dismissableMask
      className="w-[95vw] max-w-3xl"
      contentClassName="pb-8"
      footer={pie}
    >
      {enviado ? (
        <div className="py-10 text-center">
          <span
            className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-luz"
            aria-hidden="true"
          >
            <i className="pi pi-check text-xl text-noche" />
          </span>

          <p className="text-lg text-hueso">Te abrimos WhatsApp con el pedido ya escrito.</p>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-humo">
            Revisá que se haya enviado desde tu chat. Te respondo por ahí para coordinar el envío y
            el pago. Si WhatsApp no se abrió, puede estar bloqueando las ventanas emergentes.
          </p>

          <Link
            href="/"
            onClick={cerrar}
            className="mt-8 inline-block bg-luz px-6 py-3 font-display text-xs uppercase tracking-etiqueta text-noche transition-colors hover:bg-luz-calida"
          >
            Volver al catálogo
          </Link>
        </div>
      ) : vacio ? (
        <div className="py-6 text-center">
          <p className="text-lg text-hueso">Tu pedido está vacío.</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-humo">
            Elegí cualquiera de nuestras lámparas para sumarla a tu pedido. Podés combinar
            distintos productos y modelos en el mismo envío.
          </p>

          {sugeridosCatalogo.length > 0 ? (
            <div className="mt-6 grid gap-3 text-left sm:grid-cols-3">
              {sugeridosCatalogo.map((item) => (
                <Link
                  key={item.titulo}
                  href={item.href}
                  onClick={cerrar}
                  className="group flex items-center gap-3 border border-noche-borde bg-noche p-3 transition hover:border-luz sm:flex-col sm:items-start"
                >
                  <span className="relative block h-16 w-16 shrink-0 overflow-hidden bg-noche-suave sm:aspect-[4/3] sm:h-auto sm:w-full">
                    <Image
                      src={item.imagen}
                      alt={item.titulo}
                      fill
                      sizes="(max-width: 640px) 64px, 200px"
                      loading="eager"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-sm text-hueso transition-colors group-hover:text-luz">
                      {item.titulo}
                    </span>
                    <span className="block text-xs text-humo">{item.subtitulo}</span>
                    <span className="mt-1 block font-display text-xs text-luz">
                      {precioARS(item.precio)}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          ) : null}

          <Link
            href="/"
            onClick={cerrar}
            className="mt-8 inline-block bg-luz px-6 py-3 font-display text-xs uppercase tracking-etiqueta text-noche transition-colors hover:bg-luz-calida"
          >
            Ver todo el catálogo
          </Link>
        </div>
      ) : (
        <>
          <ul className="mb-8 divide-y divide-noche-borde border-y border-noche-borde">
            {lineas.map(({ variante, cantidad }) => (
              <li key={variante.slug} className="flex flex-wrap items-center gap-x-4 gap-y-3 py-4">
                <span className="relative block h-16 w-16 shrink-0 overflow-hidden bg-noche">
                  <Image
                    src={variante.imagen}
                    alt={`${variante.producto} — ${variante.patron}`}
                    fill
                    sizes="64px"
                    loading="eager"
                    className="object-cover"
                  />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block font-display text-hueso">
                    {variante.tipoProducto !== 'geometrica'
                      ? variante.producto
                      : `${variante.producto} · ${variante.nombreCorto}`}
                  </span>
                  <span className="block text-sm text-humo">
                    {cantidad > 1 ? (
                      <>
                        <span className="text-luz">
                          {precioARS(precioTotal(variante.precio, cantidad, variante.producto))}
                        </span>{' '}
                        ({precioARS(precioPorUnidad(variante.precio, cantidad, variante.producto))} c/u)
                      </>
                    ) : (
                      `${precioARS(variante.precio)} por unidad`
                    )}
                  </span>
                </span>

                <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
                  <InputNumber
                    value={cantidad}
                    onValueChange={(e) => cambiarCantidad(variante.slug, e.value ?? 1)}
                    showButtons
                    buttonLayout="horizontal"
                    min={1}
                    max={20}
                    inputClassName="w-12 text-center"
                    incrementButtonIcon="pi pi-plus"
                    decrementButtonIcon="pi pi-minus"
                    incrementButtonClassName="!w-10 !px-0 !border-campo-borde !bg-campo !text-hueso hover:!text-luz"
                    decrementButtonClassName="!w-10 !px-0 !border-campo-borde !bg-campo !text-hueso hover:!text-luz"
                    aria-label={`Cantidad de ${variante.nombreCorto}`}
                  />

                  <button
                    type="button"
                    onClick={() => quitar(variante.slug)}
                    aria-label={`Quitar ${variante.nombreCorto} del pedido`}
                    className="p-2 text-humo transition-colors hover:text-alerta"
                  >
                    <i className="pi pi-trash" aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <Link
            href="/"
            onClick={cerrar}
            className="mb-8 inline-flex items-center gap-2 font-display text-xs uppercase tracking-etiqueta text-humo transition-colors hover:text-luz"
          >
            <i className="pi pi-arrow-left text-xs" aria-hidden="true" />
            Seguir comprando
          </Link>

          <fieldset>
            <legend className="etiqueta mb-4">Datos del envío</legend>

            <div className="grid gap-4 sm:grid-cols-2">
              <Campo
                etiqueta="Nombre y apellido"
                valor={datos.nombreCompleto}
                alCambiar={(v) => actualizar('nombreCompleto', v)}
                invalido={invalido('nombreCompleto')}
                autoComplete="name"
                maxLength={LARGOS.nombreCompleto}
              />

              <Campo
                etiqueta="DNI"
                valor={datos.dni}
                alCambiar={(v) => actualizar('dni', v)}
                invalido={invalido('dni')}
                marcador="Solo números, sin puntos"
                ayuda="Lo necesito para despachar el envío a tu nombre. No se guarda en ningún lado: viaja solo dentro de tu mensaje de WhatsApp."
                inputMode="numeric"
                maxLength={LARGOS.dni}
              />

              <Campo
                etiqueta="Teléfono de contacto"
                valor={datos.telefono}
                alCambiar={(v) => actualizar('telefono', v)}
                invalido={invalido('telefono')}
                marcador="Con característica"
                inputMode="tel"
                autoComplete="tel"
                maxLength={LARGOS.telefono}
              />

              <Campo
                etiqueta="Localidad"
                valor={datos.localidad}
                alCambiar={(v) => actualizar('localidad', v)}
                invalido={invalido('localidad')}
                autoComplete="address-level2"
                maxLength={LARGOS.localidad}
              />

              <Campo
                etiqueta="Dirección completa"
                valor={datos.direccion}
                alCambiar={(v) => actualizar('direccion', v)}
                invalido={invalido('direccion')}
                marcador="Calle, número, piso y depto"
                autoComplete="street-address"
                maxLength={LARGOS.direccion}
                className="sm:col-span-2"
              />

              <Campo
                etiqueta="Código postal"
                valor={datos.codigoPostal}
                alCambiar={(v) => actualizar('codigoPostal', v)}
                invalido={invalido('codigoPostal')}
                autoComplete="postal-code"
                maxLength={LARGOS.codigoPostal}
              />
            </div>

            <label className="mt-4 flex flex-col gap-2">
              <span className="text-sm text-humo">
                Referencia del domicilio <span className="text-humo">(opcional)</span>
              </span>
              <InputTextarea
                value={datos.referencia}
                onChange={(e) => actualizar('referencia', e.target.value)}
                rows={2}
                autoResize
                maxLength={LARGOS.referencia}
                placeholder="Algo que ayude a encontrarlo: color del portón, esquina, entre qué calles"
              />
            </label>

            {intentoEnviar && faltantes.length > 0 ? (
              <p role="alert" className="mt-3 text-sm text-alerta">
                Te falta completar{' '}
                {faltantes.length === 1 ? 'un dato' : `${faltantes.length} datos`} para poder armar
                el pedido. {faltantes.length === 1 ? 'Está marcado' : 'Están marcados'} en rojo.
              </p>
            ) : null}
          </fieldset>

          <p className="mt-6 text-xs leading-relaxed text-humo">
            El envío se cotiza aparte según tu localidad. Te respondo y coordinamos pago y entrega
            por chat.
          </p>
        </>
      )}
    </Dialog>
  );
}

function Campo({
  etiqueta,
  valor,
  alCambiar,
  invalido,
  marcador,
  ayuda,
  inputMode,
  autoComplete,
  maxLength,
  className = '',
}: {
  etiqueta: string;
  valor: string;
  alCambiar: (valor: string) => void;
  invalido: boolean;
  marcador?: string;
  ayuda?: string;
  inputMode?: 'numeric' | 'tel';
  autoComplete?: string;
  maxLength?: number;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className={`text-sm ${invalido ? 'text-alerta' : 'text-humo'}`}>{etiqueta}</span>

      <span className={`block ${invalido ? 'border-l-2 border-alerta pl-2' : ''}`}>
        <InputText
          value={valor}
          onChange={(e) => alCambiar(e.target.value)}
          placeholder={marcador}
          invalid={invalido}
          className="w-full"
          inputMode={inputMode}
          autoComplete={autoComplete}
          maxLength={maxLength}
        />
      </span>

      {ayuda ? <span className="text-xs leading-relaxed text-humo">{ayuda}</span> : null}
    </label>
  );
}
