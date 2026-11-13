import fs from 'node:fs';
import path from 'node:path';

import Papa from 'papaparse';

import { descripcionesPorSlug, patronesPorSlug } from './descripciones';
import { detectarTipoProducto, type TipoProducto } from './precios';
import catalogoDeRespaldo from '../data/catalogo-respaldo.json';

const SHEET_ID = '1aZx85ZxjPE1c7aqFjKngvVbWPIa6EGQ8jj41F_vWgek';
const GID = '0';

/** La planilla publicada, exportada como CSV. No requiere login. */
export const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;

/** Una fila del CSV, tal cual viene. */
type FilaCSV = {
  id: string;
  nombre_producto: string;
  variante: string;
  categoria: string;
  precio: string;
  imagen_url: string;
  descripcion: string;
  stock: string;
  caracteristicas?: string;
  personalizable: string;
  destacado: string;
};

export type MediaGaleria = {
  tipo: 'imagen' | 'video';
  url: string;
  etiqueta: string;
};

export type Variante = {
  id: string;
  producto: string;
  variante: string;
  nombreCorto: string;
  slug: string;
  categoria: string;
  precio: number;
  imagen: string;
  descripcion: string;
  descripcionEsBorrador: boolean;
  patron: string;
  destacado: boolean;
  tipoProducto: TipoProducto;
  esLunar: boolean;
  esAstronauta: boolean;
  caracteristicas: string[];
  galeria: MediaGaleria[];
};

const GALERIA_LUNAR_EXTRA: MediaGaleria[] = [
  {
    tipo: 'imagen',
    url: '/fotos/luna/real-escritorio.webp',
    etiqueta: 'Foto real en escritorio',
  },
  {
    tipo: 'imagen',
    url: '/fotos/luna/real-ambiente.webp',
    etiqueta: 'Luz cálida en oscuridad',
  },
  {
    tipo: 'imagen',
    url: '/fotos/luna/real-textura.webp',
    etiqueta: 'Detalle del relieve lunar',
  },
  {
    tipo: 'imagen',
    url: '/fotos/luna/real-comparativa.webp',
    etiqueta: 'Terminación y base curva',
  },
  {
    tipo: 'video',
    url: '/fotos/luna/video-calida.mp4',
    etiqueta: 'Video: encendida en vivo',
  },
];

const GALERIA_ASTRONAUTA_EXTRA: MediaGaleria[] = [
  {
    tipo: 'imagen',
    url: '/fotos/astronauta/foto-completa-v2.webp',
    etiqueta: 'Foto real completa',
  },
  {
    tipo: 'imagen',
    url: '/fotos/astronauta/foto-detalle-v2.webp',
    etiqueta: 'Detalle del astronauta y la Luna',
  },
  {
    tipo: 'video',
    url: '/fotos/astronauta/video-astronauta.mp4',
    etiqueta: 'Video: encendida en vivo',
  },
];

function sinAcentos(texto: string): string {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/** "Pantalla Hexagonal Pequeño" -> "hexagonal-pequeno" */
export function slugDeVariante(variante: string): string {
  return sinAcentos(variante)
    .toLowerCase()
    .replace(/^pantalla\s+/, '')
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** "Pantalla Hexagonal Grande" -> "Hexagonal Grande" */
function nombreCortoDeVariante(variante: string): string {
  return variante.replace(/^Pantalla\s+/i, '').trim();
}

function normalizarNombreProducto(nombre: string): string {
  const limpio = nombre.trim();
  const base = sinAcentos(limpio).toLowerCase();
  if (/^lampara lunar$/.test(base)) {
    return 'Lámpara Lunar';
  }
  if (/^lampara astronautr?a$/.test(base)) {
    return 'Lámpara Astronauta';
  }
  return limpio;
}

function parsearCaracteristicas(texto?: string): string[] {
  if (!texto) return [];
  return texto
    .split(/\r?\n/)
    .map((linea) =>
      linea
        .replace(/^[\p{Emoji}\p{Emoji_Presentation}\p{Extended_Pictographic}\uFE0F\u200D\u2640-\u2642\s•-]+/gu, '')
        .trim(),
    )
    .filter((linea) => linea.length > 0 && !/^caracter[ií]sticas:?$/i.test(linea));
}

function parsearPrecio(valor: string): number {
  const limpio = String(valor ?? '')
    .replace(/[^\d,.-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  const numero = Number.parseFloat(limpio);
  return Number.isFinite(numero) ? numero : 0;
}

const CARPETA_FOTOS = path.join(process.cwd(), 'public', 'fotos');
const EXTENSIONES_FOTO = ['.webp', '.avif', '.jpg', '.jpeg', '.png'];

function fotoLocal(slug: string): string | null {
  let archivos: string[];
  try {
    archivos = fs.readdirSync(CARPETA_FOTOS);
  } catch {
    return null;
  }

  const buscado = normalizarNombreArchivo(slug);

  for (const archivo of archivos) {
    const extension = path.extname(archivo).toLowerCase();
    if (!EXTENSIONES_FOTO.includes(extension)) continue;

    const base = path.basename(archivo, path.extname(archivo));
    if (normalizarNombreArchivo(base) === buscado) {
      return `/fotos/${encodeURIComponent(archivo)}`;
    }
  }

  return null;
}

function normalizarNombreArchivo(nombre: string): string {
  return sinAcentos(nombre)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function esVerdadero(valor: string): boolean {
  return /^(true|verdadero|si|sí|1|x)$/i.test(String(valor ?? '').trim());
}

function filaAVariante(fila: FilaCSV): Variante {
  const producto = normalizarNombreProducto(fila.nombre_producto ?? '');
  const tipoProducto = detectarTipoProducto(producto || fila.variante);
  const esLunar = tipoProducto === 'lunar';
  const esAstronauta = tipoProducto === 'astronauta';

  const varianteCruda = (fila.variante ?? '').trim();
  const variante =
    varianteCruda ||
    (esAstronauta ? 'Luna 18 cm + Astronauta 15 cm | 33 cm' : producto);

  const slug = esAstronauta && !varianteCruda ? 'lampara-astronauta' : slugDeVariante(variante);
  const descripcionPropia = descripcionesPorSlug[slug];

  const fallbackFoto = esAstronauta
    ? '/fotos/lampara-astronauta.webp'
    : '/fotos/luna-18-cm-blanco-calido.webp';

  const imagenPrincipal =
    fotoLocal(slug) ?? ((fila.imagen_url ?? '').trim() || fallbackFoto);

  const galeriaExtra = esAstronauta
    ? GALERIA_ASTRONAUTA_EXTRA
    : esLunar
      ? GALERIA_LUNAR_EXTRA
      : [];

  const galeria: MediaGaleria[] = [
    {
      tipo: 'imagen',
      url: imagenPrincipal,
      etiqueta: nombreCortoDeVariante(variante),
    },
    ...galeriaExtra,
  ];

  return {
    id: String(fila.id ?? '').trim(),
    producto,
    variante,
    nombreCorto: nombreCortoDeVariante(variante),
    slug,
    categoria: (fila.categoria ?? '').trim(),
    precio: parsearPrecio(fila.precio),
    imagen: imagenPrincipal,
    descripcion: descripcionPropia ?? (fila.descripcion ?? '').trim(),
    descripcionEsBorrador: Boolean(descripcionPropia),
    patron: patronesPorSlug[slug] ?? variante.toLowerCase(),
    destacado: esVerdadero(fila.destacado),
    tipoProducto,
    esLunar,
    esAstronauta,
    caracteristicas: parsearCaracteristicas(fila.caracteristicas),
    galeria,
  };
}

function parsearCSV(texto: string): Variante[] {
  const { data, errors } = Papa.parse<FilaCSV>(texto, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => sinAcentos(h.trim().toLowerCase()),
  });

  if (errors.length > 0) {
    console.warn('[catalogo] el CSV tuvo observaciones al parsear:', errors.slice(0, 3));
  }

  return data
    .filter((fila) => {
      const tieneVariante = (fila.variante ?? '').trim().length > 0;
      const tieneDescripcion = (fila.descripcion ?? '').trim().length > 0;
      return tieneVariante || tieneDescripcion;
    })
    .map(filaAVariante);
}

/**
 * Lee el catálogo completo desde la planilla en tiempo de build.
 */
export async function obtenerCatalogo(): Promise<Variante[]> {
  try {
    const respuesta = await fetch(CSV_URL, {
      next: { revalidate: 3600 },
      headers: { 'User-Agent': 'vibesweb-build' },
    });

    if (!respuesta.ok) {
      throw new Error(`la planilla respondió ${respuesta.status}`);
    }

    const variantes = parsearCSV(await respuesta.text());

    if (variantes.length === 0) {
      throw new Error('la planilla no devolvió ninguna fila con variante');
    }

    return variantes;
  } catch (error) {
    console.warn(
      `[catalogo] no se pudo leer la planilla (${(error as Error).message}). ` +
        'Uso el snapshot de data/catalogo-respaldo.json.',
    );
    return (catalogoDeRespaldo as FilaCSV[]).map(filaAVariante);
  }
}

/** Las variantes de la Lámpara Geométrica (las 6 tramas de pantalla). */
export async function obtenerVariantesGeometricas(): Promise<Variante[]> {
  const catalogo = await obtenerCatalogo();
  return catalogo.filter((v) => v.tipoProducto === 'geometrica');
}

/** La Lámpara Lunar (si está cargada en la planilla). */
export async function obtenerVarianteLunar(): Promise<Variante | undefined> {
  const catalogo = await obtenerCatalogo();
  return catalogo.find((v) => v.tipoProducto === 'lunar');
}

/** La Lámpara Astronauta (si está cargada en la planilla). */
export async function obtenerVarianteAstronauta(): Promise<Variante | undefined> {
  const catalogo = await obtenerCatalogo();
  return catalogo.find((v) => v.tipoProducto === 'astronauta');
}

export async function obtenerVariante(slug: string): Promise<Variante | undefined> {
  const catalogo = await obtenerCatalogo();
  return catalogo.find((variante) => variante.slug === slug);
}

/** La variante geométrica marcada como `destacado` en la planilla. */
export async function obtenerDestacada(): Promise<Variante> {
  const geometricas = await obtenerVariantesGeometricas();
  return geometricas.find((variante) => variante.destacado) ?? geometricas[0];
}
