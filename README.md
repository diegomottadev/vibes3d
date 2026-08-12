# Vibes Impresiones 3D — catálogo de la Lámpara Geométrica

Catálogo de un solo producto con seis diseños de pantalla. **No hay pasarela de pago**: el visitante
arma el pedido y el sitio le abre WhatsApp con el mensaje escrito, para coordinar pago y entrega
por chat.

Stack: **Next.js 14 (App Router, SSG) + PrimeReact + Tailwind CSS**.

---

## Requisitos

Node 18 o superior **con npm**.

> En esta máquina Node v24 está instalado pero **npm falta**: la carpeta
> `C:\Program Files\nodejs\node_modules` está vacía, así que la instalación quedó incompleta.
> Se arregla reinstalando Node:
>
> ```powershell
> winget install OpenJS.NodeJS.LTS
> ```
>
> Después hay que abrir una terminal nueva para que el PATH se actualice.

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # y completá el dominio
npm run dev                  # http://localhost:3000
```

Otros comandos:

```bash
npm run build      # build de producción
npm start          # sirve el build
npm run lint       # eslint
npm run catalogo   # muestra la planilla por consola (no necesita npm install)
```

---

## Deploy en Vercel

El repo es un Next.js estándar: Vercel lo detecta solo. No hace falta `vercel.json` ni tocar los
comandos de build.

### 1. Variable de entorno (obligatoria)

| Variable | Ejemplo | Dónde |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://vibes3d.vercel.app` | Production, Preview y Development |

Sin dominio final todavía, poner la URL que asigna Vercel (`https://<proyecto>.vercel.app`) y
cambiarla cuando esté el dominio propio.

**Sin barra al final** y **sin `localhost`**: si falta o apunta a una máquina local, el build
**falla a propósito** (`lib/site.ts`) con este error:

```
Error: NEXT_PUBLIC_SITE_URL no está definida. El sitio se publicaría con canonical,
Open Graph y sitemap apuntando a una máquina local.
```

Es deliberado: sin eso el sitio se ve perfecto pero Google no indexa nada, y esa falla es
silenciosa. Mejor que reviente el deploy.

`.env.local` está en `.gitignore` y no viaja al repo: en Vercel la variable se carga a mano en
**Settings → Environment Variables**.

### 2. Pasos

1. [vercel.com/new](https://vercel.com/new) → importar `diegomottadev/vibes3d`.
2. Framework: **Next.js** (autodetectado). Build y output: los que vienen por defecto.
3. Agregar `NEXT_PUBLIC_SITE_URL` en los tres entornos.
4. **Deploy**.

### 3. Al conectar el dominio propio

Cambiar `NEXT_PUBLIC_SITE_URL` al dominio nuevo y **redeployar**: los canonical, el sitemap y las
imágenes de Open Graph se hornean en el build, así que no se actualizan solos.

### Cada cuánto se actualizan los precios

Las páginas declaran `revalidate = 3600`, así que un cambio en la planilla tarda **hasta una hora**
en verse. Para que impacte ya: **Deployments → ... → Redeploy**.

### Las fotos y el ISR

`lib/catalogo.ts` busca las fotos con `fs.readdirSync('public/fotos')`. Esa lectura también corre en
cada revalidación, dentro de una función serverless donde `public/` no existe —Vercel sube esos
archivos al CDN, no al bundle—. Por eso `next.config.mjs` declara `outputFileTracingIncludes` para
`/`, `/lampara/[slug]` y `/sitemap.xml`. **Si el catálogo se lee desde una ruta nueva, hay que
agregarla ahí**, o al cabo de una hora esa ruta cambia sola las fotos reales por el placeholder de
Unsplash, sin ningún error visible.

---

## De dónde salen los datos

El catálogo vive en una **planilla de Google publicada como CSV** y se lee en tiempo de build:

```
https://docs.google.com/spreadsheets/d/1aZx85ZxjPE1c7aqFjKngvVbWPIa6EGQ8jj41F_vWgek/export?format=csv&gid=0
```

Columnas: `id`, `nombre_producto`, `variante`, `categoria`, `precio`, `imagen_url`, `descripcion`,
`stock`, `personalizable`, `destacado`.

- **`precio`** acepta `34999`, `34.999` o `$34.999`.
- **`destacado`** marca cuál modelo encabeza la portada.
- **`stock` y `personalizable` se leen pero no se muestran**: se imprime a pedido y no hay
  personalización. La omisión es deliberada.
- **`imagen_url` es un respaldo.** Si existe `public/fotos/<slug>.<ext>`, esa foto local gana.

### Precios por cantidad

El `precio` de la planilla es el de **una** unidad. Los descuentos por cantidad **no** están en la
planilla: viven en `lib/precios.ts`, porque son totales fijos y no un porcentaje.

| Cantidad | Total | Por unidad |
| ---: | ---: | ---: |
| 1 | $34.999 | $34.999 |
| 2 | $59.999 | $30.000 |
| 3 | $74.999 | $25.000 |
| 4 | $99.999 | $25.000 |
| 5 | $124.999 | $25.000 |
| 6 o más | cantidad × $23.333,33 | $23.333 |

El descuento se calcula sobre el **total de lámparas del pedido, sin importar de qué trama sean**:
1 Voronoi + 1 Diamante son 2 unidades y pagan $59.999. Eso asume que las 6 variantes valen igual,
que es lo que dice la planilla hoy; si alguna vez tienen precios distintos, esta tabla deja de
alcanzar y hay que repensar cómo se reparte el descuento.

Si estos importes empiezan a cambiar seguido, conviene moverlos a otra hoja del mismo spreadsheet
y leerlos igual que el catálogo.

### Flujo de compra

Estilo Mercado Libre, en tres pasos:

1. **Portada** → grilla de los 6 modelos, cada uno con "Ver y pedir" a su propia URL.
2. **Página del modelo** → caja de compra fija a la derecha (`components/CajaCompra.tsx`) con precio,
   cantidad y dos acciones: *Pedir ahora* (va derecho al checkout) y *Agregar al pedido* (acumula).
3. **Checkout** (`components/DialogoPedido.tsx`) → resumen editable del pedido, datos del envío, y el
   botón que abre WhatsApp.

El pedido se guarda en `localStorage` (`vibes-pedido`), así sobrevive a recargas y permite mezclar
modelos distintos en un mismo pedido. El contador vive en el encabezado.

Las páginas declaran `revalidate = 3600`, así que **un cambio de precio en la planilla aparece solo
dentro de la hora**, sin tocar código. Para que impacte al instante, disparar un redeploy.

Si la planilla no responde durante el build, se usa el snapshot `data/catalogo-respaldo.json` para
que un problema de red no rompa el deploy. Para actualizarlo:

```bash
node scripts/ver-catalogo.mjs --guardar
```

---

## Estructura

```
app/
  layout.tsx              metadata global, fuentes, JSON-LD del negocio
  page.tsx                portada
  lampara/[slug]/page.tsx una página por modelo (las 6 se generan en el build)
  sitemap.ts robots.ts    generados a partir de la planilla
components/               UI (los que usan PrimeReact llevan 'use client')
lib/
  catalogo.ts             lectura y parseo del CSV
  descripciones.ts        textos únicos por modelo (BORRADOR, ver abajo)
  seo.ts                  JSON-LD y ficha técnica
  site.ts                 marca, WhatsApp, localidad, dominio
  whatsapp.ts             armado del mensaje y del link wa.me
data/catalogo-respaldo.json   snapshot de emergencia
public/fotos/             acá van las fotos reales (ver LEEME.md)
```

---

## SEO

- Una URL indexable por modelo: `/lampara/hexagonal-grande`, etc. Se generan estáticas en el build.
- JSON-LD de `Product` + `Offer` en cada modelo, `BreadcrumbList` en las páginas de detalle y
  `LocalBusiness` en el layout.
- Open Graph y Twitter Card, para que el link se vea bien al pegarlo en WhatsApp e Instagram.
- `sitemap.xml`, `robots.txt` y `canonical` por página.
- `next/image` sirve AVIF y WebP con los tamaños de cada pantalla.

---

## Pendientes

1. **Descripciones por modelo.** En la planilla las seis comparten el mismo texto, y eso es
   contenido duplicado entre seis URLs. Escribí un borrador distinto para cada una en
   `lib/descripciones.ts`: **hay que leerlo y corregirlo**, y lo ideal es después pasarlo a la
   columna `descripcion` de la planilla y borrar ese archivo.

2. **Dominio.** Falta definirlo y cargarlo en `NEXT_PUBLIC_SITE_URL` (ver *Deploy en Vercel*).
   Mientras tanto sirve la URL `.vercel.app`.

3. **Datos sin confirmar para las preguntas frecuentes** (están listados como comentario en
   `components/Preguntas.tsx`): si el foco LED viene incluido, cómo son los envíos y cuánto tarda
   la entrega.
