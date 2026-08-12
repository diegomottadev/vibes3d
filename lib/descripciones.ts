/**
 * BORRADOR PARA REVISIÓN — Francisco tiene que aprobar o reescribir estos textos.
 *
 * Por qué existe este archivo: en la planilla las 6 variantes comparten exactamente la misma
 * descripción. Como cada variante tiene su propia URL indexable, ese texto repetido es contenido
 * duplicado y Google terminaría indexando una sola de las seis páginas.
 *
 * Cuando estos textos estén aprobados, lo ideal es pasarlos a la columna `descripcion` de la
 * planilla y borrar este archivo: la fuente de verdad debería ser una sola.
 */

export const descripcionesPorSlug: Record<string, string> = {
  'hexagonal-grande':
    'Panal de abeja a gran escala. Los hexágonos anchos dejan pasar la luz en bloques amplios y ' +
    'proyectan una retícula limpia sobre la pared. Es la más luminosa de las seis y la que mejor ' +
    'funciona como luz de living.',

  'hexagonal-pequeno':
    'El mismo panal, con la trama cerrada. Al ser hexágonos chicos la luz sale más tamizada y el ' +
    'reflejo en la pared es un punteado fino, casi textil. Va bien en una mesa de luz, donde querés ' +
    'luz sin encandilarte.',

  'triangulo-desplazado':
    'Triángulos que no se alinean: cada hilera está corrida respecto de la anterior. La sombra que ' +
    'proyecta cambia según desde dónde la mires y nunca repite el mismo dibujo dos veces.',

  voronoi:
    'Celdas irregulares, del tipo que arma la naturaleza en el ala de una libélula. Ninguna cara se ' +
    'repite y la luz sale en fragmentos orgánicos. Es la más escultórica del conjunto.',

  'diamante-grande':
    'Rombos amplios en diagonal. Proyecta una malla romboidal marcada y tiene un aire art déco. La ' +
    'opción más gráfica si querés que la lámpara se note también apagada.',

  'diamante-horizontal':
    'El rombo estirado a lo ancho. Las líneas horizontales alargan visualmente la pantalla y tiran la ' +
    'luz hacia los costados en vez de hacia arriba. Buena para iluminar una repisa o un rincón bajo.',
};

/** Frases cortas para los `alt` de las imágenes y los títulos de las tarjetas. */
export const patronesPorSlug: Record<string, string> = {
  'hexagonal-grande': 'trama de hexágonos grandes',
  'hexagonal-pequeno': 'trama de hexágonos pequeños',
  'triangulo-desplazado': 'triángulos desplazados',
  voronoi: 'celdas Voronoi irregulares',
  'diamante-grande': 'rombos grandes en diagonal',
  'diamante-horizontal': 'rombos horizontales alargados',
};
