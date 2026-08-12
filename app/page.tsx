import { FichaTecnica } from '@/components/FichaTecnica';
import { GrillaModelos } from '@/components/GrillaModelos';
import { Hero } from '@/components/Hero';
import { JsonLd } from '@/components/JsonLd';
import { LlamadaFinal } from '@/components/LlamadaFinal';
import { Preguntas } from '@/components/Preguntas';
import { obtenerCatalogo, obtenerDestacada } from '@/lib/catalogo';
import { jsonLdPreguntas } from '@/lib/preguntas';
import { jsonLdProducto } from '@/lib/seo';

/** Se regenera cada hora: un cambio de precio en la planilla llega solo. */
export const revalidate = 3600;

export default async function Inicio() {
  const variantes = await obtenerCatalogo();
  const destacada = await obtenerDestacada();

  return (
    <>
      {/* En la home marcamos la variante destacada; cada modelo tiene su propio Product en su página. */}
      <JsonLd datos={jsonLdProducto(destacada)} />

      {/* Las mismas preguntas que muestra el acordeón, para que Google pueda desplegarlas. */}
      <JsonLd datos={jsonLdPreguntas()} />

      <Hero destacada={destacada} cantidadModelos={variantes.length} />
      <GrillaModelos variantes={variantes} />
      <FichaTecnica />
      <Preguntas />
      <LlamadaFinal />
    </>
  );
}
