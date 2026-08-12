/**
 * Precios por cantidad.
 *
 * El precio no es lineal: cuanto más lleva el cliente, menos sale cada lámpara. La tabla es de
 * TOTALES, no de precios unitarios, porque así es como se comunican y así evitamos que un redondeo
 * intermedio mueva el número final.
 *
 * OJO: estos importes están acá y no en la planilla. Si cambian los precios hay que tocar este
 * archivo. Si empiezan a cambiar seguido, conviene moverlos a una hoja aparte del mismo
 * spreadsheet y leerlos como se lee el catálogo.
 */

/** Totales fijos por cantidad. El índice es la cantidad; el 0 y el 1 no se usan. */
const TOTALES: Record<number, number> = {
  2: 59999,
  3: 74999,
  4: 99999,
  5: 124999,
};

/** Desde 6 unidades en adelante el precio pasa a ser por unidad. */
export const CANTIDAD_MAYORISTA = 6;
const UNITARIO_MAYORISTA = 23333.33;

/**
 * Total del pedido.
 *
 * - 1 unidad: el precio que trae la planilla.
 * - 2 a 5: los totales fijos de la tabla.
 * - 6 o más: cantidad × precio mayorista, truncado (6 × 23333,33 = $139.999).
 */
export function precioTotal(precioUnitarioBase: number, cantidad: number): number {
  if (cantidad <= 1) return precioUnitarioBase;
  if (cantidad >= CANTIDAD_MAYORISTA) return Math.floor(cantidad * UNITARIO_MAYORISTA);
  return TOTALES[cantidad] ?? precioUnitarioBase * cantidad;
}

/** Cuánto sale cada lámpara con esa cantidad. Sirve para mostrar "$X cada una". */
export function precioPorUnidad(precioUnitarioBase: number, cantidad: number): number {
  if (cantidad <= 0) return precioUnitarioBase;
  return precioTotal(precioUnitarioBase, cantidad) / cantidad;
}

/** Diferencia contra pagar todas al precio de una sola. 0 cuando no hay descuento. */
export function ahorro(precioUnitarioBase: number, cantidad: number): number {
  return Math.max(0, precioUnitarioBase * cantidad - precioTotal(precioUnitarioBase, cantidad));
}
