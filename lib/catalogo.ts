import fs from 'node:fs';
import path from 'node:path';

import Papa from 'papaparse';

import { descripcionesPorSlug, patronesPorSlug } from './descripciones';
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
  personalizable: string;
  destacado: string;
};

export type Variante = {
  id: string;
  producto: string;
  /** Como figura en la planilla: "Pantalla Hexagonal Grande" */
  variante: string;
  /** Sin el prefijo "Pantalla": "Hexagonal Grande" */
  nombreCorto: string;
  /** Para la URL: "hexagonal-grande" */
  slug: string;
  categoria: string;
  precio: number;
  imagen: string;
  descripcion: string;
  /** true mientras el texto salga de lib/descripciones.ts y no de la planilla. */
  descripcionEsBorrador: boolean;
  patron: string;
  destacado: boolean;
};

// Las columnas `stock` y `personalizable` se leen del CSV pero no se exponen ni se renderizan:
// hay stock permanente de los seis y no hay personalización. Se dejan documentadas acá para que quede claro
// que la omisión es deliberada y no un olvido.

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

/**
 * Acepta "34999", "34.999", "$34.999" y "34999,50".
 * En es-AR el punto es separador de miles y la coma es decimal.
 */
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

/**
 * Si en public/fotos hay una imagen para este modelo, esa le gana a la `imagen_url` de la planilla.
 * Así se cargan las fotos reales sin tocar la planilla, y mientras falte alguna esa variante sigue
 * mostrando lo que diga el CSV.
 *
 * El nombre del archivo se compara normalizado, así que `hexagonal-pequeño.webp`,
 * `Hexagonal Pequeno.WEBP` y `hexagonal-pequeno.webp` valen todos: nadie tiene que acordarse de
 * escribir el slug exacto al guardar una foto.
 */
function fotoLocal(slug: string): string | null {
  let archivos: string[];
  try {
    archivos = fs.readdirSync(CARPETA_FOTOS);
  } catch {
    return null; // todavía no existe la carpeta
  }

  const buscado = normalizarNombreArchivo(slug);

  for (const archivo of archivos) {
    const extension = path.extname(archivo).toLowerCase();
    if (!EXTENSIONES_FOTO.includes(extension)) continue;

    const base = path.basename(archivo, path.extname(archivo));
    if (normalizarNombreArchivo(base) === buscado) {
      // encodeURIComponent por si el archivo tiene ñ, tildes o espacios en el nombre.
      return `/fotos/${encodeURIComponent(archivo)}`;
    }
  }

  return null;
}

/** "Hexagonal Pequeño" y "hexagonal-pequeno" colapsan al mismo valor. */
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
  const variante = (fila.variante ?? '').trim();
  const slug = slugDeVariante(variante);
  const descripcionPropia = descripcionesPorSlug[slug];

  return {
    id: String(fila.id ?? '').trim(),
    producto: (fila.nombre_producto ?? '').trim(),
    variante,
    nombreCorto: nombreCortoDeVariante(variante),
    slug,
    categoria: (fila.categoria ?? '').trim(),
    precio: parsearPrecio(fila.precio),
    imagen: fotoLocal(slug) ?? (fila.imagen_url ?? '').trim(),
    // Si algún día la planilla trae textos distintos por fila, esos ganan y el borrador se ignora.
    descripcion: descripcionPropia ?? (fila.descripcion ?? '').trim(),
    descripcionEsBorrador: Boolean(descripcionPropia),
    patron: patronesPorSlug[slug] ?? variante.toLowerCase(),
    destacado: esVerdadero(fila.destacado),
  };
}

function parsearCSV(texto: string): Variante[] {
  const { data, errors } = Papa.parse<FilaCSV>(texto, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase(),
  });

  if (errors.length > 0) {
    console.warn('[catalogo] el CSV tuvo observaciones al parsear:', errors.slice(0, 3));
  }

  return data
    .filter((fila) => (fila.variante ?? '').trim().length > 0)
    .map(filaAVariante);
}

/**
 * Lee el catálogo desde la planilla en tiempo de build.
 *
 * `revalidate` hace que el sitio se regenere solo cada hora, así un cambio de precio en la
 * planilla llega sin tocar código ni redeployar a mano.
 *
 * Si la planilla no responde durante el build, cae al snapshot de data/catalogo-respaldo.json
 * para que un problema de red no rompa el deploy. El snapshot se actualiza con `npm run catalogo`.
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

export async function obtenerVariante(slug: string): Promise<Variante | undefined> {
  const catalogo = await obtenerCatalogo();
  return catalogo.find((variante) => variante.slug === slug);
}

/** La variante marcada como `destacado` en la planilla, o la primera si ninguna lo está. */
export async function obtenerDestacada(): Promise<Variante> {
  const catalogo = await obtenerCatalogo();
  return catalogo.find((variante) => variante.destacado) ?? catalogo[0];
}

/** Todas comparten producto y precio, así que alcanza con mirar la primera. */
export async function obtenerFichaProducto() {
  const catalogo = await obtenerCatalogo();
  const primera = catalogo[0];

  return {
    nombre: primera?.producto ?? 'Lámpara Geométrica',
    precio: primera?.precio ?? 0,
    cantidadVariantes: catalogo.length,
  };
}
