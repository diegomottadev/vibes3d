'use client';

import { PrimeReactProvider } from 'primereact/api';
import type { ReactNode } from 'react';

/**
 * PrimeReact necesita su provider en un client component. El resto del sitio se mantiene
 * como server components para que el HTML salga completo del build (que es lo que pide el SEO).
 */
export function Proveedores({ children }: { children: ReactNode }) {
  return (
    <PrimeReactProvider value={{ ripple: true, inputStyle: 'outlined' }}>
      {children}
    </PrimeReactProvider>
  );
}
