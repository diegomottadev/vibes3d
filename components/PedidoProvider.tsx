'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { Variante } from '@/lib/catalogo';
import { ahorro, precioTotal } from '@/lib/precios';
import { DialogoPedido } from './DialogoPedido';

/** Una línea del pedido: qué modelo y cuántos. */
export type Linea = { variante: Variante; cantidad: number };

type ContextoPedido = {
  variantes: Variante[];
  lineas: Linea[];
  /** Total de lámparas sumando todos los modelos. Es lo que define el descuento. */
  unidades: number;
  total: number;
  descuento: number;
  agregar: (slug: string, cantidad?: number) => void;
  cambiarCantidad: (slug: string, cantidad: number) => void;
  quitar: (slug: string) => void;
  vaciar: () => void;
  /** Abre el checkout. Con slug, primero agrega ese modelo (el "Pedir ahora"). */
  abrirPedido: (slug?: string, cantidad?: number) => void;
  /** false hasta que se leyó localStorage: evita parpadeos y errores de hidratación. */
  hidratado: boolean;
};

const Contexto = createContext<ContextoPedido | null>(null);
const CLAVE = 'vibes-pedido';

export function usePedido(): ContextoPedido {
  const contexto = useContext(Contexto);
  if (!contexto) throw new Error('usePedido tiene que usarse dentro de <PedidoProvider>');
  return contexto;
}

export function PedidoProvider({
  variantes,
  children,
}: {
  variantes: Variante[];
  children: ReactNode;
}) {
  const [items, setItems] = useState<{ slug: string; cantidad: number }[]>([]);
  const [abierto, setAbierto] = useState(false);
  const [hidratado, setHidratado] = useState(false);

  // El pedido se guarda para que sobreviva a recargas y a saltar entre las páginas de modelos.
  // Se lee en un efecto y no al renderizar: en el server no existe localStorage.
  useEffect(() => {
    try {
      const guardado = window.localStorage.getItem(CLAVE);
      if (guardado) {
        const parseado = JSON.parse(guardado) as { slug: string; cantidad: number }[];
        // Filtra modelos que ya no existan en la planilla.
        const vigentes = parseado.filter((i) => variantes.some((v) => v.slug === i.slug));
        setItems(vigentes);
      }
    } catch {
      // Un pedido corrupto o el storage bloqueado no deberían romper la página.
    }
    setHidratado(true);
  }, [variantes]);

  useEffect(() => {
    if (!hidratado) return;
    try {
      window.localStorage.setItem(CLAVE, JSON.stringify(items));
    } catch {
      /* modo incógnito o storage lleno: el pedido sigue funcionando en memoria */
    }
  }, [items, hidratado]);

  const agregar = useCallback((slug: string, cantidad = 1) => {
    setItems((previos) => {
      const existente = previos.find((i) => i.slug === slug);
      if (existente) {
        return previos.map((i) =>
          i.slug === slug ? { ...i, cantidad: Math.min(20, i.cantidad + cantidad) } : i,
        );
      }
      return [...previos, { slug, cantidad: Math.min(20, cantidad) }];
    });
  }, []);

  const cambiarCantidad = useCallback((slug: string, cantidad: number) => {
    setItems((previos) =>
      cantidad <= 0
        ? previos.filter((i) => i.slug !== slug)
        : previos.map((i) => (i.slug === slug ? { ...i, cantidad: Math.min(20, cantidad) } : i)),
    );
  }, []);

  const quitar = useCallback((slug: string) => {
    setItems((previos) => previos.filter((i) => i.slug !== slug));
  }, []);

  const vaciar = useCallback(() => setItems([]), []);

  const abrirPedido = useCallback(
    (slug?: string, cantidad = 1) => {
      if (slug) agregar(slug, cantidad);
      setAbierto(true);
    },
    [agregar],
  );

  const lineas = useMemo(
    () =>
      items
        .map((item) => {
          const variante = variantes.find((v) => v.slug === item.slug);
          return variante ? { variante, cantidad: item.cantidad } : null;
        })
        .filter((l): l is Linea => l !== null),
    [items, variantes],
  );

  const unidades = useMemo(() => lineas.reduce((suma, l) => suma + l.cantidad, 0), [lineas]);

  // El descuento se calcula sobre el total de lámparas, sin importar de qué trama sean:
  // el costo de producción es el mismo y así se premia armar un pedido variado.
  //
  // Esto asume que las 6 variantes valen igual, que es lo que dice la planilla hoy. Si alguna
  // vez tienen precios distintos, la tabla de lib/precios.ts deja de alcanzar y hay que
  // repensar cómo se reparte el descuento.
  const precioBase = variantes[0]?.precio ?? 0;
  const total = useMemo(() => precioTotal(precioBase, unidades), [precioBase, unidades]);
  const descuento = useMemo(() => ahorro(precioBase, unidades), [precioBase, unidades]);

  const valor = useMemo(
    () => ({
      variantes,
      lineas,
      unidades,
      total,
      descuento,
      agregar,
      cambiarCantidad,
      quitar,
      vaciar,
      abrirPedido,
      hidratado,
    }),
    [
      variantes,
      lineas,
      unidades,
      total,
      descuento,
      agregar,
      cambiarCantidad,
      quitar,
      vaciar,
      abrirPedido,
      hidratado,
    ],
  );

  return (
    <Contexto.Provider value={valor}>
      {children}
      <DialogoPedido abierto={abierto} alCerrar={() => setAbierto(false)} />
    </Contexto.Provider>
  );
}
