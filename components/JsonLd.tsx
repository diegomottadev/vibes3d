/**
 * Inserta datos estructurados. Es un server component: el JSON-LD queda en el HTML del build,
 * que es la única forma de que los rastreadores lo lean sin ejecutar JavaScript.
 */
export function JsonLd({ datos }: { datos: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // El contenido lo generamos nosotros a partir de la planilla, no viene del usuario.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(datos) }}
    />
  );
}
