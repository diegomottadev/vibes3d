import type { Variante } from './catalogo';
import { sitio } from './site';

export type DatosFicha = {
  materiales: string;
  materialesCorto: string;
  iluminacion: string;
  cable: string;
  soporte: string;
  dimensionesTexto: string;
  anchoMm: number;
  altoMm: number;
  disponibilidad: string;
};

/** Ficha técnica común a las 6 variantes de la Lámpara Geométrica. */
export const ficha: DatosFicha = {
  materiales:
    'Su estructura con soporte de trípode está elaborada en PLA, un material resistente y de ' +
    'origen biológico, mientras que la pantalla está fabricada en PETG, ofreciendo una mayor ' +
    'resistencia a los impactos, al calor y al uso diario.',
  materialesCorto: 'Estructura en PLA, pantalla en PETG',
  iluminacion: 'Foco LED 6V de luz cálida',
  cable: 'Cable de 1,5 m con interruptor y enchufe macho para 220V',
  soporte: 'Trípode incluido',
  dimensionesTexto: '130 mm × 230 mm',
  anchoMm: 130,
  altoMm: 230,
  disponibilidad: 'Stock permanente de los seis modelos',
};

/** Ficha técnica de la Lámpara Lunar (18 cm). */
export const fichaLunar: DatosFicha = {
  materiales:
    'Esfera con relieve texturado inspirado en la superficie real de la Luna y soporte ' +
    'curvo orgánico de alta resistencia.',
  materialesCorto: 'Esfera con relieve lunar y base curva',
  iluminacion: 'Luz LED 220 V - 6 W (tono blanco cálido)',
  cable: 'Cable armado blanco de 1,5 m con interruptor y ficha macho para 220 V',
  soporte: 'Base curva de apoyo incluida',
  dimensionesTexto: '18 cm (180 mm) de diámetro',
  anchoMm: 180,
  altoMm: 180,
  disponibilidad: 'Stock permanente — Lista para enchufar y usar',
};

/** Ficha técnica de la Lámpara Astronauta (33 cm). */
export const fichaAstronauta: DatosFicha = {
  materiales:
    'Esfera de 18 cm con relieve texturado de la superficie real de la Luna sostenida por una ' +
    'figura de astronauta de 15 cm de alta definición y resistencia.',
  materialesCorto: 'Luna de 18 cm con relieve + base Astronauta de 15 cm',
  iluminacion: 'Luz LED 220 V - 6 W (tono blanco cálido)',
  cable: 'Cable blanco de 1,5 m con enchufe e interruptor incluidos para 220 V',
  soporte: 'Figura de Astronauta de 15 cm incluida',
  dimensionesTexto: '33 cm de altura total (Luna 18 cm + Astronauta 15 cm)',
  anchoMm: 180,
  altoMm: 330,
  disponibilidad: 'Stock permanente — Lista para enchufar y disfrutar',
};

/** Ficha técnica de la Lámpara Mini Luna (15 cm). */
export const fichaMiniLuna: DatosFicha = {
  materiales:
    'Esfera de 15 cm con relieve texturado inspirado en la superficie lunar y base cilíndrica ' +
    'minimalista de alta resistencia.',
  materialesCorto: 'Esfera con relieve lunar de 15 cm y base cilíndrica',
  iluminacion: 'Luz LED regulable con control remoto incluido',
  cable: 'Cable USB incluido (compatible con cualquier cargador USB)',
  soporte: 'Base cilíndrica blanca de apoyo y control remoto incluidos',
  dimensionesTexto: '15 cm (150 mm) de diámetro',
  anchoMm: 150,
  altoMm: 150,
  disponibilidad: 'Stock permanente — Lista para conectar y usar',
};

/** Ficha técnica de las Macetas Animadas. */
export const fichaMaceta: DatosFicha = {
  materiales:
    'Elaboradas en PLA de origen biológico y alta resistencia, aptas para plantas de interior, ' +
    'suculentas y cactus.',
  materialesCorto: 'Estructura resistente con patitas articuladas',
  iluminacion: 'Dorado, Naranja, Verde, Blanco, Gris y Negro',
  cable: 'Patitas y bracitos articulados para sentar en bordes o superficies planas',
  soporte: 'Apoyo estable con manitos laterales integradas',
  dimensionesTexto: '8 cm de alto × 14,8 cm de ancho × 12,8 cm de profundidad (con patitas)',
  anchoMm: 148,
  altoMm: 80,
  disponibilidad: 'Stock permanente en los 6 colores',
};

export function obtenerFichaDeVariante(
  variante?: Pick<
    Variante,
    'esLunar' | 'esAstronauta' | 'esMiniLuna' | 'esMaceta' | 'tipoProducto'
  >,
): DatosFicha {
  if (variante?.esMaceta || variante?.tipoProducto === 'maceta') {
    return fichaMaceta;
  }
  if (variante?.esAstronauta || variante?.tipoProducto === 'astronauta') {
    return fichaAstronauta;
  }
  if (variante?.esMiniLuna || variante?.tipoProducto === 'mini-luna') {
    return fichaMiniLuna;
  }
  if (variante?.esLunar || variante?.tipoProducto === 'lunar') {
    return fichaLunar;
  }
  return ficha;
}

export function urlDeVariante(slug: string): string {
  return `${sitio.url}/lampara/${slug}`;
}

export function jsonLdProducto(variante: Variante) {
  const datosFicha = obtenerFichaDeVariante(variante);

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
      value: datosFicha.anchoMm,
      unitCode: 'MMT',
    },
    height: {
      '@type': 'QuantitativeValue',
      value: datosFicha.altoMm,
      unitCode: 'MMT',
    },
    offers: {
      '@type': 'Offer',
      url: urlDeVariante(variante.slug),
      price: variante.precio,
      priceCurrency: sitio.moneda,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: sitio.marca,
      },
    },
  };
}

export function jsonLdNegocio() {
  if (!sitio.localidad.confirmada) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: sitio.marca,
    description: `${sitio.tagline}. Lámpara Astronauta, Lámpara Lunar y Lámparas Geométricas de mesa.`,
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

export function jsonLdMigas(variante: Variante) {
  const anclaSeccion = variante.esAstronauta
    ? '#astronauta'
    : variante.esMiniLuna
      ? '#mini-luna'
      : variante.esMaceta
        ? '#macetas'
        : variante.esLunar
          ? '#lunar'
          : '#modelos';

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
        item: `${sitio.url}/${anclaSeccion}`,
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
