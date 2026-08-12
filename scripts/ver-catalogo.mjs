/**
 * Lee la planilla y muestra el catálogo por consola. Con --guardar además actualiza
 * data/catalogo-respaldo.json, el snapshot que se usa si la planilla no responde durante el build.
 *
 *   node scripts/ver-catalogo.mjs
 *   node scripts/ver-catalogo.mjs --guardar
 *
 * No usa dependencias: corre con node pelado, sin npm install.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SHEET_ID = '1aZx85ZxjPE1c7aqFjKngvVbWPIa6EGQ8jj41F_vWgek';
const GID = '0';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;

const raizProyecto = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const destino = path.join(raizProyecto, 'data', 'catalogo-respaldo.json');

/** Parser de CSV que respeta comillas y comas dentro de los campos. */
function parsearCSV(texto) {
  const filas = [];
  let campo = '';
  let fila = [];
  let entreComillas = false;

  const limpio = texto.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  for (let i = 0; i < limpio.length; i++) {
    const c = limpio[i];

    if (entreComillas) {
      if (c === '"') {
        if (limpio[i + 1] === '"') {
          campo += '"';
          i++;
        } else {
          entreComillas = false;
        }
      } else {
        campo += c;
      }
      continue;
    }

    if (c === '"') entreComillas = true;
    else if (c === ',') {
      fila.push(campo);
      campo = '';
    } else if (c === '\n') {
      fila.push(campo);
      filas.push(fila);
      fila = [];
      campo = '';
    } else campo += c;
  }

  if (campo.length > 0 || fila.length > 0) {
    fila.push(campo);
    filas.push(fila);
  }

  const [encabezados, ...resto] = filas;
  return resto
    .filter((f) => f.some((v) => v.trim() !== ''))
    .map((f) =>
      Object.fromEntries(encabezados.map((h, i) => [h.trim().toLowerCase(), (f[i] ?? '').trim()])),
    );
}

const guardar = process.argv.includes('--guardar');

try {
  const respuesta = await fetch(CSV_URL);
  if (!respuesta.ok) throw new Error(`la planilla respondió ${respuesta.status}`);

  const filas = parsearCSV(await respuesta.text());

  console.log(`\n${filas.length} variantes en la planilla:\n`);
  for (const fila of filas) {
    console.log(`  ${String(fila.id).padStart(2)}  ${String(fila.variante).padEnd(30)} $${fila.precio}`);
  }

  const descripciones = new Set(filas.map((f) => f.descripcion));
  if (descripciones.size === 1 && filas.length > 1) {
    console.log('\n  Aviso: las variantes comparten la misma descripción en la planilla.');
    console.log('  Los textos únicos por variante están en lib/descripciones.ts (borrador).');
  }

  const imagenes = new Set(filas.map((f) => f.imagen_url));
  if (imagenes.size === 1 && filas.length > 1) {
    console.log('\n  Aviso: las variantes comparten la misma imagen. Faltan las fotos reales.');
  }

  if (guardar) {
    fs.writeFileSync(destino, `${JSON.stringify(filas, null, 2)}\n`, 'utf8');
    console.log(`\n  Snapshot actualizado: ${path.relative(raizProyecto, destino)}`);
  }

  console.log('');
} catch (error) {
  console.error(`\nNo pude leer la planilla: ${error.message}\n`);
  process.exit(1);
}
