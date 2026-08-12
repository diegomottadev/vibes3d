import type { MetadataRoute } from 'next';

import { obtenerCatalogo } from '@/lib/catalogo';
import { sitio } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const variantes = await obtenerCatalogo();
  const ahora = new Date();

  return [
    {
      url: sitio.url,
      lastModified: ahora,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...variantes.map((variante) => ({
      url: `${sitio.url}/lampara/${variante.slug}`,
      lastModified: ahora,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
