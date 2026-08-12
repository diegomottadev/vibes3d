'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { useState } from 'react';

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
  const { lineas, unidades, total, descuento, cambiarCantidad, quitar, vaciar } = usePedido();
  const [datos, setDatos] = useState<DatosEnvio>(DATOS_VACIOS);
  const [intentoEnviar, setIntentoEnviar] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const vacio = lineas.length === 0;
  const faltantes = OBLIGATORIOS.filter((campo) => datos[campo].trim().length === 0);

  /**
   * Cerrar también da por terminada la confirmación: si no, al volver a abrir el diálogo con un
   * pedido nuevo seguiría mostrando el cartel del envío anterior.
   */
  function cerrar() {
    setEnviado(false);
    alCerrar();
  }

  /** Cada campo se filtra a medida que se escribe: el DNI, por ejemplo, no acepta letras. */
  function actualizar(campo: keyof DatosEnvio, valor: string) {
    setDatos((previos) => ({ ...previos, [campo]: filtros[campo](valor) }));
  }

  /** Marca el campo en rojo solo después del primer intento de envío, no mientras se escribe. */
  function invalido(campo: keyof DatosEnvio): boolean {
    return intentoEnviar && datos[campo].trim().length === 0;
  }

  function enviar() {
    setIntentoEnviar(true);
    if (vacio || faltantes.length > 0) return;

    // Normalización final: sin saltos de línea ni espacios repetidos, para que nadie pueda
    // agregar líneas falsas al mensaje del pedido.
    const limpios = Object.fromEntries(
      Object.entries(datos).map(([campo, valor]) => [campo, limpiarParaMensaje(valor)]),
    ) as DatosEnvio;

    window.open(
      urlWhatsApp({ lineas, unidades, total, datos: limpios }),
      '_blank',
      'noopener,noreferrer',
    );

    // El pedido ya viaja dentro del mensaje de WhatsApp, así que acá se cierra el ciclo: se vacía
    // el carrito y el diálogo pasa a mostrar la confirmación en vez del formulario.
    //
    // Ojo: `window.open` solo abre WhatsApp con el texto redactado, todavía falta que la persona
    // apriete enviar. Por eso la confirmación le pide que lo revise en el chat en vez de darlo por
    // hecho. Los datos del envío sí se conservan, que es lo que más cuesta volver a tipear.
    vaciar();
    setIntentoEnviar(false);
    setEnviado(true);
  }

  /*
    El total y el botón van en el `footer` del Dialog: queda fuera del área que scrollea,
    así que el precio y el CTA se ven siempre, por más largo que sea el formulario.
  */
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

          {/*
            No se afirma que el mensaje salió: `window.open` solo redacta el chat, el envío lo hace
            la persona. Decirle que revise es lo que evita que se quede esperando una respuesta
            a un mensaje que nunca mandó.
          */}
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-humo">
            Revisá que se haya enviado desde tu chat. Te respondo por ahí para coordinar el envío y
            el pago. Si WhatsApp no se abrió, puede estar bloqueando las ventanas emergentes.
          </p>

          <Link
            href="/#modelos"
            onClick={cerrar}
            className="mt-8 inline-block bg-luz px-6 py-3 font-display text-xs uppercase tracking-etiqueta text-noche transition-colors hover:bg-luz-calida"
          >
            Seguir viendo modelos
          </Link>
        </div>
      ) : vacio ? (
        <div className="py-10 text-center">
          <p className="text-lg text-hueso">Todavía no elegiste ninguna lámpara.</p>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-humo">
            Entrá a cualquiera de los seis modelos y agregalo desde ahí. Podés mezclar tramas
            distintas en el mismo pedido.
          </p>
          <Link
            href="/#modelos"
            onClick={cerrar}
            className="mt-8 inline-block bg-luz px-6 py-3 font-display text-xs uppercase tracking-etiqueta text-noche transition-colors hover:bg-luz-calida"
          >
            Ver los modelos
          </Link>
        </div>
      ) : (
        <>
          <ul className="mb-8 divide-y divide-noche-borde border-y border-noche-borde">
            {/*
              En pantallas chicas los controles bajan a una segunda línea (`w-full sm:w-auto`):
              el nombre, la cantidad y el tacho no entran en 390px sin pisarse.
            */}
            {lineas.map(({ variante, cantidad }) => (
              <li key={variante.slug} className="flex flex-wrap items-center gap-x-4 gap-y-3 py-4">
                <span className="relative block h-16 w-16 shrink-0 overflow-hidden bg-noche">
                  <Image
                    src={variante.imagen}
                    alt={`Lámpara Geométrica con ${variante.patron}`}
                    fill
                    sizes="64px"
                    // Sin lazy: son seis miniaturas diminutas dentro de un modal que ya se abrió.
                    // Esperar a que el navegador las descubra deja huecos negros en el resumen.
                    loading="eager"
                    className="object-cover"
                  />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block font-display text-hueso">{variante.nombreCorto}</span>
                  <span className="block text-sm text-humo">
                    {precioARS(variante.precio)} por unidad
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
                    // Los +/- son controles del campo, no acciones principales: van neutros y
                    // chicos. Se fuerza desde acá porque el estilo ámbar de .p-button gana por
                    // especificidad sobre cualquier regla que pongamos en la hoja.
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

          {/* Salida hacia la grilla sin perder lo cargado: el pedido vive en localStorage,
              así que volver a elegir modelos no cuesta nada. */}
          <Link
            href="/#modelos"
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
                // La razón y la garantía de privacidad van acá, junto al campo que genera la duda,
                // y no al final del formulario donde ya no evitan que alguien abandone.
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

      {/*
        El error se marca con una barra roja en un span propio, y no pintando el borde del input:
        los estilos de PrimeReact terminan ganando sobre cualquier color que le pongamos al campo.
        Además el color no va solo: la etiqueta también cambia, para quien no distingue rojos.
      */}
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
