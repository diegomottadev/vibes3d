import { precioARS, sitio } from './site';
import type { Variante } from './catalogo';

export type LineaPedido = { variante: Variante; cantidad: number };

export type DatosEnvio = {
  nombreCompleto: string;
  dni: string;
  telefono: string;
  direccion: string;
  localidad: string;
  codigoPostal: string;
  /** Opcional: alguna seña que ayude al repartidor a encontrar el domicilio. */
  referencia: string;
};

export type Pedido = {
  lineas: LineaPedido[];
  /** Total de lámparas sumando todos los modelos. */
  unidades: number;
  /** Ya con el descuento por cantidad aplicado. */
  total: number;
  datos: DatosEnvio;
};

/**
 * El texto que llega por WhatsApp. Lo lee una persona, así que va en bloques:
 * primero qué se pide, después a quién y adónde va.
 *
 * Estos datos nunca pasan por un servidor nuestro: viajan en el mensaje que el propio
 * comprador envía desde su WhatsApp.
 */
export function armarMensaje(pedido: Pedido): string {
  const { lineas, total, datos } = pedido;

  // Sin emojis. El de la lámpara (U+1FA94, agregado en Unicode 12) no existe en muchos
  // teléfonos y llega como un rombo con signo de pregunta. El mensaje tiene que verse igual
  // en cualquier dispositivo, así que se usa solo texto y puntuación común.
  const lineasTexto = [
    'Hola! Quiero hacer un pedido.',
    '',
    ...lineas.map((l) => `• ${l.cantidad} × ${l.variante.producto} ${l.variante.nombreCorto}`),
    '',
  ];

  // Solo el total. El desglose por unidad ya se ve en el sitio antes de enviar, y en el
  // chat sumaba ruido al renglón más importante del mensaje.
  lineasTexto.push(`Total: ${precioARS(total)}`);

  lineasTexto.push(
    '',
    `Nombre y apellido: ${datos.nombreCompleto.trim()}`,
    `DNI: ${datos.dni.trim()}`,
    `Teléfono: ${datos.telefono.trim()}`,
    `Dirección: ${datos.direccion.trim()}`,
    `Localidad: ${datos.localidad.trim()}`,
    `Código postal: ${datos.codigoPostal.trim()}`,
  );

  if (datos.referencia.trim().length > 0) {
    lineasTexto.push(`Referencia: ${datos.referencia.trim()}`);
  }

  lineasTexto.push('', `— Enviado desde ${sitio.url}`);

  return lineasTexto.join('\n');
}

/** El link que abre WhatsApp con el mensaje ya escrito. */
export function urlWhatsApp(pedido: Pedido): string {
  return `https://wa.me/${sitio.whatsapp}?text=${encodeURIComponent(armarMensaje(pedido))}`;
}

/** Para los botones de consulta suelta, sin pedido armado. */
export function urlConsulta(texto = 'Hola! Tengo una consulta sobre la Lámpara Geométrica.'): string {
  return `https://wa.me/${sitio.whatsapp}?text=${encodeURIComponent(texto)}`;
}
