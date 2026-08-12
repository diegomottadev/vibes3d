/**
 * Limpieza de lo que se escribe en el formulario.
 *
 * Hay dos momentos distintos:
 *
 * 1. Mientras se escribe (`filtros`): se sacan los caracteres que ese campo no admite. Es lo que
 *    impide, por ejemplo, escribir letras en el DNI. No se recorta ni se colapsan espacios acá,
 *    porque hacerlo mientras alguien tipea se siente como que el campo pelea.
 *
 * 2. Al enviar (`limpiarParaMensaje`): se normalizan espacios y se eliminan los saltos de línea.
 *    Esto último importa: el mensaje de WhatsApp se arma con una línea por dato, así que un salto
 *    de línea escrito en un campo podría agregar una línea falsa al pedido — algo tipo
 *    "Total: $0". Con todo en una sola línea, el mensaje no se puede falsificar.
 */

/** Caracteres de control invisibles, incluidos los que invierten el sentido del texto. */
const CONTROL = /[\u0000-\u001F\u007F-\u009F\u200B-\u200F\u2028\u2029\u202A-\u202E]/g;

export const LARGOS = {
  nombreCompleto: 80,
  dni: 9,
  telefono: 20,
  direccion: 120,
  localidad: 60,
  codigoPostal: 8,
  referencia: 200,
} as const;

/**
 * Normaliza antes de filtrar: los saltos de línea y tabulaciones pasan a ser espacios (si se
 * borraran sin más, "Calle 1\nPiso 2" quedaría pegado como "Calle 1Piso 2"), y después se
 * eliminan el resto de los invisibles.
 *
 * OJO: acá NO se recorta al largo máximo. Recortar antes de filtrar rompe los datos: pegar
 * "30.123.456" en el DNI daría "30.123.45" y, al sacar los puntos, un documento equivocado.
 * El recorte va siempre al final, cuando el valor ya está limpio.
 */
function base(valor: string): string {
  return valor.replace(/[\r\n\t]+/g, ' ').replace(CONTROL, '');
}

export const filtros = {
  /** Nombres: letras, espacios, apóstrofos y guiones. Sin dígitos ni símbolos. */
  nombreCompleto: (v: string) =>
    base(v)
      .replace(/[^\p{L}\p{M}\s'’.-]/gu, '')
      .slice(0, LARGOS.nombreCompleto),

  /** DNI: solo dígitos. Nada de puntos, letras ni espacios. */
  dni: (v: string) => base(v).replace(/\D/g, '').slice(0, LARGOS.dni),

  /** Teléfono: dígitos y los signos que la gente usa para separarlos. */
  telefono: (v: string) =>
    base(v)
      .replace(/[^\d\s()+-]/g, '')
      .slice(0, LARGOS.telefono),

  /** Dirección: texto libre en una sola línea. */
  direccion: (v: string) => base(v).slice(0, LARGOS.direccion),

  localidad: (v: string) =>
    base(v)
      .replace(/[^\p{L}\p{M}\s'’.-]/gu, '')
      .slice(0, LARGOS.localidad),

  /**
   * Código postal: alfanumérico y en mayúsculas. No se fuerza a números porque el CPA
   * argentino los mezcla (3328, pero también B1636ABC).
   */
  codigoPostal: (v: string) =>
    base(v)
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .slice(0, LARGOS.codigoPostal),

  /** Referencia: texto libre; los saltos de línea ya quedaron aplanados en `base`. */
  referencia: (v: string) => base(v).slice(0, LARGOS.referencia),
} as const;

/**
 * Normaliza un valor justo antes de meterlo en el mensaje: sin saltos de línea, sin espacios
 * repetidos y sin espacios sobrantes en los extremos.
 */
export function limpiarParaMensaje(valor: string): string {
  return valor.replace(CONTROL, '').replace(/\s+/g, ' ').trim();
}
