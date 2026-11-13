import type { Variante } from './catalogo';
import { ficha, fichaAstronauta, fichaLunar, fichaMaceta, fichaMiniLuna } from './seo';

export type ItemPregunta = {
  pregunta: string;
  respuesta: string;
};

const COMUNES_ENVIO_Y_PEDIDO: ItemPregunta[] = [
  {
    pregunta: '¿Cómo hago el pedido?',
    respuesta:
      'Elegís la cantidad, completás tus datos de envío y el sitio te abre WhatsApp con el ' +
      'pedido ya escrito. A partir de ahí coordinamos el pago y la entrega por chat.',
  },
  {
    pregunta: '¿Hacés envíos?',
    respuesta:
      'Sí, a todo el país por Correo Argentino. Al coordinar el pedido por WhatsApp te confirmo ' +
      'el costo del envío según tu localidad y cuándo sale.',
  },
  {
    pregunta: '¿Tenés stock disponible?',
    respuesta:
      'Sí, contamos con stock permanente de todos nuestros modelos para despacho rápido.',
  },
];

export const preguntasGeometrica: ItemPregunta[] = [
  {
    pregunta: '¿En qué se diferencian los seis modelos de la Lámpara Geométrica?',
    respuesta:
      'En el diseño de la pantalla, que define el dibujo y cómo se distribuye la luz al ' +
      'encenderla. La estructura con trípode, las medidas y el precio son los mismos en las seis.',
  },
  {
    pregunta: '¿De qué material está hecha?',
    respuesta: ficha.materiales,
  },
  {
    pregunta: '¿Qué tamaño tiene?',
    respuesta: `${ficha.anchoMm} mm de ancho por ${ficha.altoMm} mm de alto (13 × 23 cm) con el trípode incluido. Va muy bien en una mesa de luz, un escritorio o una repisa.`,
  },
  {
    pregunta: '¿El foco y el cable vienen incluidos?',
    respuesta:
      'Sí, viene completa con su foco LED de luz cálida y cable de 1,5 m con interruptor y ' +
      'enchufe para 220 V: la enchufás y ya funciona.',
  },
  ...COMUNES_ENVIO_Y_PEDIDO,
];

export const preguntasLunar: ItemPregunta[] = [
  {
    pregunta: '¿Qué tamaño tiene la Lámpara Lunar?',
    respuesta:
      'La esfera tiene 18 cm de diámetro e incluye su base curva de apoyo para colocarla sobre ' +
      'cualquier mesa de luz, escritorio o repisa.',
  },
  {
    pregunta: '¿Cómo es la textura de la Luna?',
    respuesta: fichaLunar.materiales,
  },
  {
    pregunta: '¿Qué tipo de luz trae y cómo se conecta?',
    respuesta:
      `Incluye ${fichaLunar.iluminacion.toLowerCase()} y ${fichaLunar.cable.toLowerCase()}. ` +
      'No usa pilas ni baterías que se agoten: la enchufás directo a 220 V y está lista para usar.',
  },
  {
    pregunta: '¿La base y el foco vienen incluidos?',
    respuesta:
      'Sí, incluye la esfera lunar de 18 cm, la base curva de apoyo, la lámpara LED cálida ' +
      'instalada y el cable blanco con interruptor.',
  },
  ...COMUNES_ENVIO_Y_PEDIDO,
];

export const preguntasAstronauta: ItemPregunta[] = [
  {
    pregunta: '¿Cuáles son las medidas de la Lámpara Astronauta?',
    respuesta:
      'Tiene una altura total de 33 cm: combina la esfera de la Luna de 18 cm de diámetro con ' +
      'el astronauta de 15 cm de altura que la sostiene.',
  },
  {
    pregunta: '¿Viene lista para enchufar?',
    respuesta:
      `Sí. Incluye ${fichaAstronauta.iluminacion.toLowerCase()} y ${fichaAstronauta.cable.toLowerCase()}. ` +
      'Solo tenés que enchufarla a 220 V y encenderla desde el interruptor.',
  },
  {
    pregunta: '¿La Luna queda firme sobre el astronauta?',
    respuesta:
      'Sí, el soporte superior y las manos del astronauta están diseñados a medida para que la ' +
      'esfera lunar de 18 cm apoye con total estabilidad.',
  },
  {
    pregunta: '¿Qué incluye la caja?',
    respuesta:
      'La figura del astronauta de 15 cm, la esfera lunar de 18 cm con relieve, la luz LED cálida ' +
      'y el cable blanco de 1,5 m con interruptor y enchufe.',
  },
  ...COMUNES_ENVIO_Y_PEDIDO,
];

export const preguntasMiniLuna: ItemPregunta[] = [
  {
    pregunta: '¿Qué tamaño tiene la Lámpara Mini Luna?',
    respuesta:
      'La esfera tiene 15 cm de diámetro e incluye su base cilíndrica blanca de apoyo, ideal para ' +
      'mesas de luz, escritorios, repisas o rincones de lectura.',
  },
  {
    pregunta: '¿Cómo funciona el control remoto?',
    respuesta:
      'El control remoto incluido permite encender, apagar y ajustar cómodamente los tonos e ' +
      'intensidad de la iluminación LED a distancia para adaptar el ambiente a tu gusto.',
  },
  {
    pregunta: '¿Cómo se alimenta la lámpara?',
    respuesta:
      `Incluye ${fichaMiniLuna.cable.toLowerCase()}. Podés conectarla a cualquier cargador de ` +
      'celular USB estándar, puerto de computadora o batería externa.',
  },
  {
    pregunta: '¿Qué incluye la caja?',
    respuesta:
      'La esfera lunar de 15 cm con relieve texturado, la base cilíndrica blanca de apoyo, ' +
      'el control remoto y el cable de alimentación USB.',
  },
  ...COMUNES_ENVIO_Y_PEDIDO,
];

export const preguntasMaceta: ItemPregunta[] = [
  {
    pregunta: '¿En qué colores vienen las Macetas Animadas?',
    respuesta:
      'Están disponibles en 6 colores: Dorado, Naranja, Verde, Blanco, Gris y Negro. Al enviar tu ' +
      'pedido por WhatsApp podés indicarnos qué colores preferís o combinarlos como quieras.',
  },
  {
    pregunta: '¿Cuáles son las medidas de la maceta?',
    respuesta:
      `${fichaMaceta.dimensionesTexto}. Es el tamaño ideal para suculentas, pequeños cactus o ` +
      'plantas decorativas de interior.',
  },
  {
    pregunta: '¿Las patitas son articuladas?',
    respuesta:
      'Sí, las patitas cuentan con eslabones articulados que les dan movimiento natural para que ' +
      'puedas apoyarlas en el borde de un estante, escritorio o mesa con las patitas colgando.',
  },
  {
    pregunta: '¿De qué material están hechas?',
    respuesta: fichaMaceta.materiales,
  },
  ...COMUNES_ENVIO_Y_PEDIDO,
];

export function obtenerPreguntasDeVariante(
  variante?: Pick<
    Variante,
    'esLunar' | 'esAstronauta' | 'esMiniLuna' | 'esMaceta' | 'tipoProducto'
  >,
): ItemPregunta[] {
  if (variante?.esMaceta || variante?.tipoProducto === 'maceta') {
    return preguntasMaceta;
  }
  if (variante?.esAstronauta || variante?.tipoProducto === 'astronauta') {
    return preguntasAstronauta;
  }
  if (variante?.esMiniLuna || variante?.tipoProducto === 'mini-luna') {
    return preguntasMiniLuna;
  }
  if (variante?.esLunar || variante?.tipoProducto === 'lunar') {
    return preguntasLunar;
  }
  return preguntasGeometrica;
}

export function jsonLdPreguntas(
  variante?: Pick<
    Variante,
    'esLunar' | 'esAstronauta' | 'esMiniLuna' | 'esMaceta' | 'tipoProducto'
  >,
) {
  const lista = obtenerPreguntasDeVariante(variante);
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: lista.map((item) => ({
      '@type': 'Question',
      name: item.pregunta,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.respuesta,
      },
    })),
  };
}
