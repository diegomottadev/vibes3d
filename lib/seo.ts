import type { Variante } from './catalogo';
import { sitio } from './site';

/** Ficha técnica común a las 6 variantes. Sale del pedido, no de la planilla. */
export const ficha = {
  materiales:
    'Su estructura con soporte de trípode está elaborada en PLA, un material resistente y de ' +
    'origen biológico, mientras que la pantalla está fabricada en PETG, ofreciendo una mayor ' +
    'resistencia a los impactos, al calor y al uso diario.',
  /** Versión corta para los lugares donde no entra el párrafo completo. */
  materialesCorto: 'Estructura en PLA, pantalla en PETG',
  iluminacion: 'Foco LED 6V de luz cálida',
  cable: 'Cable de 1,5 m con interruptor y enchufe macho para 220V',
  anchoMm: 130,
  altoMm: 230,
} as const;

export function urlDeVariante(slug: string): string {
  return `${sitio.url}/lampara/${slug}`;
}

/**
 * JSON-LD de Product + Offer. Es lo que hace que Google pueda mostrar el precio
 * directamente en el resultado de búsqueda.
 */
export function jsonLdProducto(variante: Variante) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${variante.producto} — ${variante.nombreCorto}`,
    description: variante.descripcion,
    image: [variante.imagen],
    sku: `LG-${variante.id}`,
    brand: {
      '@type': 'Brand',
      name: sitio.marca,
    },
    category: variante.categoria,
    width: {
      '@type': 'QuantitativeValue',
      value: ficha.anchoMm,
      unitCode: 'MMT',
    },
    height: {
      '@type': 'QuantitativeValue',
      value: ficha.altoMm,
      unitCode: 'MMT',
    },
    offers: {
      '@type': 'Offer',
      url: urlDeVariante(variante.slug),
      price: variante.precio,
      priceCurrency: sitio.moneda,
      // Se imprime a pedido, así que siempre hay disponibilidad.
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: sitio.marca,
      },
    },
  };
}

/**
 * JSON-LD de LocalBusiness. Solo se emite cuando la localidad está confirmada:
 * un dato de dirección inventado es peor que no tener el marcado.
 */
export function jsonLdNegocio() {
  if (!sitio.localidad.confirmada) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: sitio.marca,
    description: `${sitio.tagline}. Lámparas geométricas impresas en 3D.`,
    url: sitio.url,
    telephone: sitio.whatsappVisible,
    address: {
      '@type': 'PostalAddress',
      addressLocality: sitio.localidad.ciudad,
      addressRegion: sitio.localidad.provincia,
      addressCountry: sitio.localidad.pais,
    },
    priceRange: '$$',
  };
}

/** Migas de pan para las páginas de variante. */
export function jsonLdMigas(variante: Variante) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: sitio.url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: variante.producto,
        item: `${sitio.url}/#modelos`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: variante.nombreCorto,
        item: urlDeVariante(variante.slug),
      },
    ],
  };
}
