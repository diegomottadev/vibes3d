import { GrillaModelos } from '@/components/GrillaModelos';
import { JsonLd } from '@/components/JsonLd';
import { LlamadaFinal } from '@/components/LlamadaFinal';
import { SeccionLunar } from '@/components/SeccionLunar';
import {
  obtenerDestacada,
  obtenerVarianteAstronauta,
  obtenerVarianteLunar,
  obtenerVariantesGeometricas,
} from '@/lib/catalogo';
import { jsonLdProducto } from '@/lib/seo';

/** Se regenera cada hora: un cambio de precio en la planilla llega solo. */
export const revalidate = 3600;

export default async function Inicio() {
  const variantesGeometricas = await obtenerVariantesGeometricas();
  const destacada = await obtenerDestacada();
  const lunar = await obtenerVarianteLunar();
  const astronauta = await obtenerVarianteAstronauta();

  return (
    <>
      <JsonLd datos={jsonLdProducto(destacada)} />
      {lunar ? <JsonLd datos={jsonLdProducto(lunar)} /> : null}
      {astronauta ? <JsonLd datos={jsonLdProducto(astronauta)} /> : null}

      {astronauta ? (
        <SeccionLunar
          lunar={astronauta}
          idSeccion="astronauta"
          etiquetaDestaque="Nuevo producto"
          subtituloEtiqueta="Luna 18 cm + Astronauta · 33 cm de altura"
        />
      ) : null}

      {lunar ? (
        <SeccionLunar
          lunar={lunar}
          idSeccion="lunar"
          etiquetaDestaque="Destacado"
          subtituloEtiqueta="Luz de ambiente · 18 cm"
        />
      ) : null}

      <GrillaModelos variantes={variantesGeometricas} />
      <LlamadaFinal />
    </>
  );
}
