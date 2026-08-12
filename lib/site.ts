/**
 * Datos del negocio. Todo lo que se cambia sin tocar componentes vive acá.
 */

/**
 * En tu máquina, localhost está bien. En el build del hosting no: si NEXT_PUBLIC_SITE_URL falta
 * o quedó apuntando a localhost, los canonical, las imágenes de Open Graph y el sitemap se
 * publican con una dirección que nadie puede visitar, y Google no indexa nada. Es una falla
 * silenciosa —el sitio se ve perfecto— así que preferimos que el deploy falle.
 *
 * El corte es "estamos en un servidor de build" (CI/Vercel/Netlify) y no `NODE_ENV`, porque
 * `next build` corre en producción también acá, donde `.env.local` provee localhost a propósito.
 */
function urlDelSitio(): string {
  const configurada = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '');
  const apuntaAMiMaquina =
    !configurada || /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:|\/|$)/i.test(configurada);

  if (!apuntaAMiMaquina) return configurada;

  const esBuildDeHosting = Boolean(process.env.CI || process.env.VERCEL || process.env.NETLIFY);

  if (esBuildDeHosting) {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL ${configurada ? `apunta a ${configurada}` : 'no está definida'}. ` +
        'El sitio se publicaría con canonical, Open Graph y sitemap apuntando a una máquina local. ' +
        'Configurá el dominio real en las variables de entorno del hosting (ver .env.example).',
    );
  }

  return configurada || 'http://localhost:3000';
}

export const sitio = {
  marca: 'Vibes Impresiones 3D',
  tagline: 'Impresión 3D en Argentina',

  /**
   * URL canónica. Se toma de la variable de entorno para no hardcodear un dominio
   * que todavía no existe. Ver .env.example.
   */
  url: urlDelSitio(),

  /** Número al que llega el pedido, en formato internacional sin signos (wa.me lo exige así). */
  whatsapp: '5493743610783',
  whatsappVisible: '+54 3743 610783',

  /** Confirmada por Francisco. Habilita el JSON-LD de LocalBusiness. */
  localidad: {
    ciudad: 'Jardín América',
    provincia: 'Misiones',
    pais: 'AR',
    confirmada: true,
  },

  instagram: '', // opcional: URL del perfil, si querés mostrarlo en el footer

  moneda: 'ARS',
  locale: 'es-AR',
};
// Sin `as const` a propósito: `confirmada` tiene que ser `boolean` y no el literal `false`,
// para que al cambiarlo a true el resto del código siga tipando igual.

/** Formatea un número como precio argentino: 34999 -> "$34.999" */
export function precioARS(valor: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(valor);
}
