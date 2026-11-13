/**
 * Precios por cantidad, diferenciados por línea de producto.
 *
 * - Lámpara Geométrica ($34.999 base):
 *   1 u: $34.999 | 2 u: $59.999 | 3 u: $74.999 | 4 u: $99.999 | 5 u: $124.999 | 6+ u: $23.333,33 c/u
 *
 * - Lámpara Lunar ($44.900 base):
 *   1 u: $44.900 | 2 u: $84.900 | 3+ u: $119.000 las 3 ($39.666,67 c/u)
 *
 * - Lámpara Astronauta ($64.900 base):
 *   1 u: $64.900 | 2 u: $119.000 ($59.500 c/u) | 3 o más: $56.900 c/u
 *
 * - Lámpara Mini Luna ($37.900 base):
 *   1 u: $37.900 | 2 u: $69.900 ($34.950 c/u) | 3 o más: $32.900 c/u ($98.700 las 3)
 *
 * - Macetas Animadas ($13.900 base):
 *   1 u: $13.900 | 2 u: $25.900 ($12.950 c/u) | 3 o más: $11.900 c/u ($35.700 las 3)
 */

export type TipoProducto = 'geometrica' | 'lunar' | 'astronauta' | 'mini-luna' | 'maceta';

/** Totales fijos por cantidad para la Lámpara Geométrica. */
const TOTALES_GEOMETRICA: Record<number, number> = {
  2: 59999,
  3: 74999,
  4: 99999,
  5: 124999,
};

export const CANTIDAD_MAYORISTA = 6;
const UNITARIO_MAYORISTA_GEOMETRICA = 23333.33;

/** Totales fijos por cantidad para la Lámpara Lunar. */
const TOTALES_LUNAR: Record<number, number> = {
  2: 84900,
  3: 119000,
};

export const CANTIDAD_PACK_LUNAR = 3;
const UNITARIO_PACK_LUNAR = 119000 / 3;

/** Totales fijos por cantidad para la Lámpara Astronauta. */
const TOTALES_ASTRONAUTA: Record<number, number> = {
  2: 119000,
};

export const CANTIDAD_PACK_ASTRONAUTA = 3;
const UNITARIO_PACK_ASTRONAUTA = 56900;

/** Totales fijos por cantidad para la Lámpara Mini Luna. */
const TOTALES_MINI_LUNA: Record<number, number> = {
  2: 69900,
};

export const CANTIDAD_PACK_MINI_LUNA = 3;
const UNITARIO_PACK_MINI_LUNA = 32900;

/** Totales fijos por cantidad para Macetas Animadas. */
const TOTALES_MACETA: Record<number, number> = {
  2: 25900,
};

export const CANTIDAD_PACK_MACETA = 3;
const UNITARIO_PACK_MACETA = 11900;

export function detectarTipoProducto(productoOSlug = ''): TipoProducto {
  const texto = productoOSlug.trim();
  if (/maceta/i.test(texto)) return 'maceta';
  if (/astronaut/i.test(texto)) return 'astronauta';
  if (/mini[\s-]*luna/i.test(texto)) return 'mini-luna';
  if (/lunar|^luna-/i.test(texto)) return 'lunar';
  return 'geometrica';
}

export function esProductoLunarPorNombre(productoOSlug = ''): boolean {
  return detectarTipoProducto(productoOSlug) === 'lunar';
}

/**
 * Total para una cantidad de unidades de un mismo producto.
 */
export function precioTotal(
  precioUnitarioBase: number,
  cantidad: number,
  productoOSlug = '',
): number {
  if (cantidad <= 0) return 0;
  if (cantidad === 1) return precioUnitarioBase;

  const tipo = detectarTipoProducto(productoOSlug);

  if (tipo === 'astronauta') {
    if (TOTALES_ASTRONAUTA[cantidad]) return TOTALES_ASTRONAUTA[cantidad];
    if (cantidad >= CANTIDAD_PACK_ASTRONAUTA) {
      return Math.round(cantidad * UNITARIO_PACK_ASTRONAUTA);
    }
    return precioUnitarioBase * cantidad;
  }

  if (tipo === 'mini-luna') {
    if (TOTALES_MINI_LUNA[cantidad]) return TOTALES_MINI_LUNA[cantidad];
    if (cantidad >= CANTIDAD_PACK_MINI_LUNA) {
      return Math.round(cantidad * UNITARIO_PACK_MINI_LUNA);
    }
    return precioUnitarioBase * cantidad;
  }

  if (tipo === 'maceta') {
    if (TOTALES_MACETA[cantidad]) return TOTALES_MACETA[cantidad];
    if (cantidad >= CANTIDAD_PACK_MACETA) {
      return Math.round(cantidad * UNITARIO_PACK_MACETA);
    }
    return precioUnitarioBase * cantidad;
  }

  if (tipo === 'lunar') {
    if (TOTALES_LUNAR[cantidad]) return TOTALES_LUNAR[cantidad];
    if (cantidad > CANTIDAD_PACK_LUNAR) {
      return Math.round(cantidad * UNITARIO_PACK_LUNAR);
    }
    return precioUnitarioBase * cantidad;
  }

  if (cantidad >= CANTIDAD_MAYORISTA) {
    return Math.floor(cantidad * UNITARIO_MAYORISTA_GEOMETRICA);
  }
  return TOTALES_GEOMETRICA[cantidad] ?? precioUnitarioBase * cantidad;
}

/** Cuánto sale cada lámpara llevando esa cantidad. */
export function precioPorUnidad(
  precioUnitarioBase: number,
  cantidad: number,
  productoOSlug = '',
): number {
  if (cantidad <= 0) return precioUnitarioBase;
  return Math.round(precioTotal(precioUnitarioBase, cantidad, productoOSlug) / cantidad);
}

/** Diferencia contra pagar todas al precio de una sola. */
export function ahorro(
  precioUnitarioBase: number,
  cantidad: number,
  productoOSlug = '',
): number {
  if (cantidad <= 1) return 0;
  return Math.max(
    0,
    precioUnitarioBase * cantidad - precioTotal(precioUnitarioBase, cantidad, productoOSlug),
  );
}

/**
 * Calcula el total y el descuento de un pedido completo agrupando por línea de producto.
 */
export function calcularTotalesPedido(
  lineas: { variante: { producto: string; slug: string; precio: number }; cantidad: number }[],
): { unidades: number; total: number; descuento: number } {
  const grupos: Record<TipoProducto, { unidades: number; precioBase: number }> = {
    geometrica: { unidades: 0, precioBase: 34999 },
    lunar: { unidades: 0, precioBase: 44900 },
    astronauta: { unidades: 0, precioBase: 64900 },
    'mini-luna': { unidades: 0, precioBase: 37900 },
  };

  for (const linea of lineas) {
    const tipo = detectarTipoProducto(linea.variante.producto || linea.variante.slug);
    grupos[tipo].unidades += linea.cantidad;
    grupos[tipo].precioBase = linea.variante.precio;
  }

  let unidades = 0;
  let total = 0;
  let descuento = 0;

  for (const [tipo, datos] of Object.entries(grupos) as [
    TipoProducto,
    { unidades: number; precioBase: number },
  ][]) {
    if (datos.unidades > 0) {
      unidades += datos.unidades;
      total += precioTotal(datos.precioBase, datos.unidades, tipo);
      descuento += ahorro(datos.precioBase, datos.unidades, tipo);
    }
  }

  return { unidades, total, descuento };
}
