import type { Metadata } from 'next';
import { Manrope, Space_Grotesk } from 'next/font/google';

import 'primereact/resources/themes/lara-dark-amber/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './globals.css';

import { Encabezado } from '@/components/Encabezado';
import { PedidoProvider } from '@/components/PedidoProvider';
import { PiePagina } from '@/components/PiePagina';
import { Proveedores } from '@/components/Proveedores';
import { JsonLd } from '@/components/JsonLd';
import { obtenerCatalogo, obtenerDestacada } from '@/lib/catalogo';
import { jsonLdNegocio } from '@/lib/seo';
import { sitio } from '@/lib/site';

const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

// Manrope y no Inter: Inter es la fuente por defecto de medio internet y de casi todo lo
// generado por IA. Para un producto que se vende por su diseño, la tipografía es parte del producto.
const sans = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

/**
 * La cantidad de modelos y la localidad salen de los datos, no de un texto fijo: si mañana hay
 * siete pantallas, la descripción que ve Google se actualiza sola.
 */
function descripcionDelSitio(cantidadModelos: number): string {
  const lugar = sitio.localidad.confirmada
    ? `${sitio.localidad.ciudad}, ${sitio.localidad.provincia}`
    : 'Argentina';

  return (
    `Lámpara Geométrica de mesa, en ${cantidadModelos} diseños de pantalla. ` +
    `Stock permanente en ${lugar}. Elegís tu modelo y coordinamos todo por WhatsApp.`
  );
}

/**
 * Es `generateMetadata` y no un objeto fijo porque la imagen de Open Graph es la foto de la
 * variante destacada: sin ella, compartir el sitio por WhatsApp muestra un rectángulo vacío,
 * justo en el canal por el que entra cada pedido.
 */
export async function generateMetadata(): Promise<Metadata> {
  const variantes = await obtenerCatalogo();
  const destacada = await obtenerDestacada();
  const descripcion = descripcionDelSitio(variantes.length);
  const titulo = 'Lámpara Geométrica de mesa';
  const imagen = {
    url: destacada.imagen,
    alt: `Lámpara Geométrica con ${destacada.patron}, encendida`,
  };

  return {
    metadataBase: new URL(sitio.url),
    title: {
      default: `${titulo} | ${sitio.marca}`,
      template: `%s | ${sitio.marca}`,
    },
    description: descripcion,
    applicationName: sitio.marca,
    keywords: [
      'lámpara geométrica',
      'lámpara de mesa',
      'lámpara decorativa',
      'lámpara voronoi',
      'lámpara hexagonal',
      'luz de ambiente',
    ],
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      locale: 'es_AR',
      siteName: sitio.marca,
      title: titulo,
      description: descripcion,
      url: sitio.url,
      images: [imagen],
    },
    twitter: {
      card: 'summary_large_image',
      title: titulo,
      description: descripcion,
      images: [imagen],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const negocio = jsonLdNegocio();
  // El catálogo se lee una sola vez y baja al modal de pedido, que necesita las 6 variantes
  // esté donde esté el visitante.
  const variantes = await obtenerCatalogo();

  return (
    <html lang="es-AR" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-screen font-sans">
        {negocio ? <JsonLd datos={negocio} /> : null}
        <Proveedores>
          <PedidoProvider variantes={variantes}>
            <Encabezado />
            <main>{children}</main>
            <PiePagina />
          </PedidoProvider>
        </Proveedores>
      </body>
    </html>
  );
}
