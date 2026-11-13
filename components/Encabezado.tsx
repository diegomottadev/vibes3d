'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { usePedido } from './PedidoProvider';

type SubitemMenu = {
  etiqueta: string;
  href: string;
};

const MENU_LAMPARAS: SubitemMenu[] = [
  { etiqueta: 'Lámpara Astronauta', href: '/#astronauta' },
  { etiqueta: 'Lámpara Mini Luna', href: '/#mini-luna' },
  { etiqueta: 'Lámpara Lunar', href: '/#lunar' },
  { etiqueta: 'Lámparas Geométricas', href: '/#modelos' },
];

const MENU_MACETAS: SubitemMenu[] = [
  { etiqueta: 'Macetas Animadas', href: '/#macetas' },
];

export function Encabezado() {
  const { unidades, abrirPedido, hidratado } = usePedido();
  const [menuAbierto, setMenuAbierto] = useState<'lamparas' | 'macetas' | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function alClickAfuera(evento: MouseEvent) {
      if (navRef.current && !navRef.current.contains(evento.target as Node)) {
        setMenuAbierto(null);
      }
    }
    document.addEventListener('mousedown', alClickAfuera);
    return () => document.removeEventListener('mousedown', alClickAfuera);
  }, []);

  function alternarMenu(menu: 'lamparas' | 'macetas') {
    setMenuAbierto((actual) => (actual === menu ? null : menu));
  }

  return (
    <header className="sticky top-0 z-40 border-b border-noche-borde bg-noche/90 backdrop-blur">
      <div className="contenedor flex h-16 items-center justify-between gap-4">
        <Link href="/" className="font-display text-lg tracking-tight text-hueso">
          VIBES<span className="text-luz">.</span>
        </Link>

        <nav ref={navRef} className="flex items-center gap-4 sm:gap-6">
          {/* Menú Lámparas */}
          <div
            className="relative"
            onMouseEnter={() => setMenuAbierto('lamparas')}
            onMouseLeave={() => setMenuAbierto((actual) => (actual === 'lamparas' ? null : actual))}
          >
            <button
              type="button"
              onClick={() => alternarMenu('lamparas')}
              aria-expanded={menuAbierto === 'lamparas'}
              className="etiqueta flex items-center gap-1.5 py-2 transition-colors hover:text-luz"
            >
              <span>Lámparas</span>
              <i
                className={`pi pi-chevron-down text-[10px] transition-transform duration-200 ${
                  menuAbierto === 'lamparas' ? 'rotate-180 text-luz' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            {menuAbierto === 'lamparas' ? (
              <div className="absolute left-0 top-full z-50 w-56 pt-1 sm:left-auto sm:right-0">
                <ul className="divide-y divide-noche-borde border border-noche-borde bg-noche-suave shadow-2xl">
                  {MENU_LAMPARAS.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMenuAbierto(null)}
                        className="block px-4 py-3 font-display text-xs uppercase tracking-etiqueta text-hueso transition-colors hover:bg-noche hover:text-luz"
                      >
                        {item.etiqueta}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          {/* Menú Macetas */}
          <div
            className="relative"
            onMouseEnter={() => setMenuAbierto('macetas')}
            onMouseLeave={() => setMenuAbierto((actual) => (actual === 'macetas' ? null : actual))}
          >
            <button
              type="button"
              onClick={() => alternarMenu('macetas')}
              aria-expanded={menuAbierto === 'macetas'}
              className="etiqueta flex items-center gap-1.5 py-2 transition-colors hover:text-luz"
            >
              <span>Macetas</span>
              <i
                className={`pi pi-chevron-down text-[10px] transition-transform duration-200 ${
                  menuAbierto === 'macetas' ? 'rotate-180 text-luz' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            {menuAbierto === 'macetas' ? (
              <div className="absolute right-0 top-full z-50 w-52 pt-1">
                <ul className="divide-y divide-noche-borde border border-noche-borde bg-noche-suave shadow-2xl">
                  {MENU_MACETAS.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMenuAbierto(null)}
                        className="block px-4 py-3 font-display text-xs uppercase tracking-etiqueta text-hueso transition-colors hover:bg-noche hover:text-luz"
                      >
                        {item.etiqueta}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

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
                aria-label={`${unidades} productos en el pedido`}
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
