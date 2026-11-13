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
  disponibilidad: 'En stock o por encargo — Despacho en 2 a 7 días hábiles',
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
  disponibilidad: 'En stock o por encargo — Despacho en 2 a 7 días hábiles',
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
  disponibilidad: 'En stock o por encargo — Despacho en 2 a 7 días hábiles',
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
  disponibilidad: 'En stock o por encargo — Despacho en 2 a 7 días hábiles',
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
  disponibilidad: 'En stock o por encargo en los 6 colores — Despacho en 2 a 7 días hábiles',
};

/** Ficha técnica de la Lámpara Hive (13 × 23 cm). */
export const fichaHive: DatosFicha = {
  materiales:
    'Pantalla cilíndrica de trama panal texturada y base sólida con acabado orgánico de alta ' +
    'resistencia al calor y al uso diario.',
  materialesCorto: 'Pantalla de trama panal y base texturada',
  iluminacion: 'Luz LED 220 V - 6 W (tono blanco cálido)',
  cable: 'Cable de 1,5 m con enchufe e interruptor incluidos para 220 V',
  soporte: 'Base cilíndrica texturada integrada',
  dimensionesTexto: '13 cm de diámetro × 23 cm de altura total',
  anchoMm: 130,
  altoMm: 230,
  disponibilidad: 'En stock o por encargo — Despacho en 2 a 7 días hábiles',
};

/** Ficha técnica de la Lámpara Infinity (18 × 24 cm). */
export const fichaInfinity: DatosFicha = {
  materiales:
    'Pantalla escultórica de curvas continuas envolventes y soporte de trípode de alta ' +
    'resistencia al calor y al uso diario.',
  materialesCorto: 'Pantalla de curvas fluidas y base trípode',
  iluminacion: 'Luz LED 220 V - 6 W (tono blanco cálido)',
  cable: 'Cable de 1,5 m con enchufe e interruptor incluidos para 220 V',
  soporte: 'Base trípode integrada',
  dimensionesTexto: '18 cm de diámetro × 24 cm de altura total',
  anchoMm: 180,
  altoMm: 240,
  disponibilidad: 'En stock o por encargo — Despacho en 2 a 7 días hábiles',
};

/** Ficha técnica de la Lámpara Halo (16 × 21 cm). */
export const fichaHalo: DatosFicha = {
  materiales:
    'Pantalla esférica de anillos horizontales que tamizan la salida de luz y base cilíndrica ' +
    'texturada de alta resistencia al calor y al uso diario.',
  materialesCorto: 'Pantalla de anillos horizontales y base texturada',
  iluminacion: 'Luz LED 220 V - 6 W (tono blanco cálido)',
  cable: 'Cable de 1,5 m con enchufe e interruptor incluidos para 220 V',
  soporte: 'Base cilíndrica texturada integrada',
  dimensionesTexto: '16 cm de diámetro × 21 cm de altura total',
  anchoMm: 160,
  altoMm: 210,
  disponibilidad: 'En stock o por encargo — Despacho en 2 a 7 días hábiles',
};

export function obtenerFichaDeVariante(
  variante?: Pick<
    Variante,
    | 'esLunar'
    | 'esAstronauta'
    | 'esMiniLuna'
    | 'esMaceta'
    | 'esHive'
    | 'esInfinity'
    | 'esHalo'
    | 'tipoProducto'
  >,
): DatosFicha {
  if (variante?.esHalo || variante?.tipoProducto === 'halo') {
    return fichaHalo;
  }
  if (variante?.esInfinity || variante?.tipoProducto === 'infinity') {
    return fichaInfinity;
  }
  if (variante?.esHive || variante?.tipoProducto === 'hive') {
    return fichaHive;
  }
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
  const imagenAbsoluta = variante.imagen.startsWith('http')
    ? variante.imagen
    : `${sitio.url}${variante.imagen}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${variante.producto} — ${variante.nombreCorto}`,
    description: variante.descripcion,
    image: [imagenAbsoluta],
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
    description: sitio.tagline,
    url: sitio.url,
    logo: `${sitio.url}/fotos/og-vibes.jpg`,
    image: `${sitio.url}/fotos/og-vibes.jpg`,
    telephone: sitio.whatsappVisible,
    sameAs: sitio.instagram ? [sitio.instagram] : undefined,
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
      : variante.esHalo
        ? '#halo'
        : variante.esInfinity
          ? '#infinity'
          : variante.esHive
            ? '#hive'
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
