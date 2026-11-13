import type { Variante } from './catalogo';
import { ficha, fichaAstronauta, fichaLunar } from './seo';

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

export function obtenerPreguntasDeVariante(
  variante?: Pick<Variante, 'esLunar' | 'esAstronauta' | 'tipoProducto'>,
): ItemPregunta[] {
  if (variante?.esAstronauta || variante?.tipoProducto === 'astronauta') {
    return preguntasAstronauta;
  }
  if (variante?.esLunar || variante?.tipoProducto === 'lunar') {
    return preguntasLunar;
  }
  return preguntasGeometrica;
}

export function jsonLdPreguntas(
  variante?: Pick<Variante, 'esLunar' | 'esAstronauta' | 'tipoProducto'>,
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
