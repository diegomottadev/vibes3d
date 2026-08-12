import { ficha } from './seo';

/**
 * Solo preguntas que se pueden responder con datos confirmados.
 *
 * Viven acá y no en el componente porque se usan dos veces: para el acordeón que ve la persona
 * y para el JSON-LD que lee Google. Una sola fuente, así nunca se desincronizan.
 *
 * PENDIENTE de confirmar con Francisco:
 *  - ¿Hay retiro en persona en Jardín América? Sería una pregunta aparte.
 *  - ¿Cuánto tarda en imprimirse y entregarse? Hoy tanto "¿Hacés envíos?" como "¿Tenés stock?"
 *    esquivan el plazo mandándolo a WhatsApp. Es la objeción más cara de no responder: un plazo
 *    concreto acá evita la consulta previa al pedido.
 */
export const preguntas = [
  {
    pregunta: '¿En qué se diferencian los seis modelos?',
    respuesta:
      'Solo en la trama de la pantalla, que es lo que define el dibujo que se ve al encenderla y ' +
      'cuánta luz deja pasar. El cuerpo, el trípode y las medidas son los mismos, y todos valen ' +
      'igual.',
  },
  {
    pregunta: '¿De qué material está hecha?',
    respuesta: ficha.materiales,
  },
  {
    pregunta: '¿Qué tamaño tiene?',
    respuesta: `${ficha.anchoMm} mm de ancho por ${ficha.altoMm} mm de alto, con el trípode incluido. Es una lámpara de mesa: va bien en una mesa de luz, un escritorio o una repisa.`,
  },
  {
    pregunta: '¿El foco viene incluido?',
    respuesta:
      'Sí, viene con la lámpara: no hay que comprarlo aparte. También trae el cable con ' +
      'interruptor y enchufe de 220 V, así que la conectás y ya funciona.',
  },
  {
    pregunta: '¿Qué tipo de luz usa?',
    respuesta: `${ficha.iluminacion}. Esa es la que hace que la trama se vea tibia y no blanca.`,
  },
  {
    pregunta: '¿Cómo hago el pedido?',
    respuesta:
      'Elegís el modelo y la cantidad, dejás tu nombre y tu ciudad, y el sitio te abre WhatsApp ' +
      'con el pedido ya escrito. A partir de ahí coordinamos el pago y la entrega por chat.',
  },
  {
    pregunta: '¿Hacés envíos?',
    respuesta:
      'Sí, por Correo Argentino. Al coordinar el pedido por WhatsApp te confirmo el costo del ' +
      'envío según tu ciudad y cuándo sale.',
  },
  {
    pregunta: '¿Tenés stock?',
    respuesta:
      'Sí, tenemos stock permanente de los seis modelos: no hay que esperar a que se imprima. ' +
      'Al escribirme te confirmo cuándo sale tu pedido.',
  },
];

/**
 * JSON-LD de FAQPage. Es lo que le permite a Google desplegar las preguntas debajo del
 * resultado de búsqueda, ocupando más alto de pantalla con las respuestas ya escritas.
 *
 * Google exige que cada respuesta marcada esté visible en la página: por eso sale del mismo
 * array que renderiza el acordeón y no de un texto aparte.
 */
export function jsonLdPreguntas() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: preguntas.map((item) => ({
      '@type': 'Question',
      name: item.pregunta,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.respuesta,
      },
    })),
  };
}
