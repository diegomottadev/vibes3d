import { GrillaModelos } from '@/components/GrillaModelos';
import { JsonLd } from '@/components/JsonLd';
import { LlamadaFinal } from '@/components/LlamadaFinal';
import { SeccionLunar } from '@/components/SeccionLunar';
import {
  obtenerDestacada,
  obtenerVarianteAstronauta,
  obtenerVarianteHalo,
  obtenerVarianteHive,
  obtenerVarianteInfinity,
  obtenerVarianteLunar,
  obtenerVarianteMaceta,
  obtenerVarianteMiniLuna,
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
  const miniLuna = await obtenerVarianteMiniLuna();
  const hive = await obtenerVarianteHive();
  const infinity = await obtenerVarianteInfinity();
  const halo = await obtenerVarianteHalo();
  const maceta = await obtenerVarianteMaceta();

  return (
    <>
      <JsonLd datos={jsonLdProducto(destacada)} />
      {lunar ? <JsonLd datos={jsonLdProducto(lunar)} /> : null}
      {astronauta ? <JsonLd datos={jsonLdProducto(astronauta)} /> : null}
      {miniLuna ? <JsonLd datos={jsonLdProducto(miniLuna)} /> : null}
      {hive ? <JsonLd datos={jsonLdProducto(hive)} /> : null}
      {infinity ? <JsonLd datos={jsonLdProducto(infinity)} /> : null}
      {halo ? <JsonLd datos={jsonLdProducto(halo)} /> : null}
      {maceta ? <JsonLd datos={jsonLdProducto(maceta)} /> : null}

      {astronauta ? (
        <SeccionLunar
          lunar={astronauta}
          idSeccion="astronauta"
          etiquetaDestaque="Destacado"
          subtituloEtiqueta="Luna 18 cm + Astronauta · 33 cm de altura"
        />
      ) : null}

      {halo ? (
        <SeccionLunar
          lunar={halo}
          idSeccion="halo"
          etiquetaDestaque="Nuevo producto"
          subtituloEtiqueta="Luz cálida 220 V · 16 × 21 cm"
        />
      ) : null}

      {infinity ? (
        <SeccionLunar
          lunar={infinity}
          idSeccion="infinity"
          etiquetaDestaque="Nuevo producto"
          subtituloEtiqueta="Luz cálida 220 V · 18 × 24 cm"
        />
      ) : null}

      {hive ? (
        <SeccionLunar
          lunar={hive}
          idSeccion="hive"
          etiquetaDestaque="Nuevo producto"
          subtituloEtiqueta="Luz cálida 220 V · 13 × 23 cm"
        />
      ) : null}

      {miniLuna ? (
        <SeccionLunar
          lunar={miniLuna}
          idSeccion="mini-luna"
          etiquetaDestaque="Nuevo producto"
          subtituloEtiqueta="Luz LED con control remoto · 15 cm"
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

      {maceta ? (
        <SeccionLunar
          lunar={maceta}
          idSeccion="macetas"
          etiquetaDestaque="Nuevo producto"
          subtituloEtiqueta="Con patitas articuladas · 6 colores disponibles"
        />
      ) : null}

      <LlamadaFinal />
    </>
  );
}
