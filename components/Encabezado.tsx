'use client';

import Link from 'next/link';

import { usePedido } from './PedidoProvider';

export function Encabezado() {
  const { unidades, abrirPedido, hidratado } = usePedido();

  return (
    <header className="sticky top-0 z-40 border-b border-noche-borde bg-noche/85 backdrop-blur">
      <div className="contenedor flex h-16 items-center justify-between gap-6">
        <Link href="/" className="font-display text-lg tracking-tight text-hueso">
          VIBES<span className="text-luz">.</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/#astronauta"
            className="etiqueta hidden transition-colors hover:text-luz sm:block"
          >
            Astronauta
          </Link>
          <Link
            href="/#lunar"
            className="etiqueta hidden transition-colors hover:text-luz sm:block"
          >
            Lunar
          </Link>
          <Link
            href="/#modelos"
            className="etiqueta hidden transition-colors hover:text-hueso sm:block"
          >
            Geométricas
          </Link>

          {hidratado && unidades > 0 ? (
            <button
              type="button"
              onClick={() => abrirPedido()}
              className="flex items-center gap-2 bg-luz px-4 py-2 font-display text-xs uppercase tracking-etiqueta text-noche transition-colors hover:bg-luz-calida"
            >
              <i className="pi pi-shopping-bag text-sm" aria-hidden="true" />
              Mi pedido
              <span
                className="flex h-5 min-w-5 items-center justify-center rounded-full bg-noche px-1 text-[11px] text-luz"
                aria-label={`${unidades} lámparas en el pedido`}
              >
                {unidades}
              </span>
            </button>
          ) : (
            <Link
              href="/#astronauta"
              className="bg-luz px-4 py-2 font-display text-xs uppercase tracking-etiqueta text-noche transition-colors hover:bg-luz-calida"
            >
              Ver catálogo
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
