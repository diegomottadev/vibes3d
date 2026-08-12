'use client';

import { Accordion, AccordionTab } from 'primereact/accordion';

import { preguntas } from '@/lib/preguntas';

export function Preguntas() {
  return (
    <section className="border-b border-noche-borde py-20 md:py-28">
      <div className="contenedor grid gap-12 md:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="etiqueta">Preguntas</p>
          <h2 className="mt-4 font-display text-4xl leading-tight tracking-tight text-hueso">
            Lo que se suele preguntar.
          </h2>
        </div>

        <Accordion multiple>
          {preguntas.map((item) => (
            <AccordionTab key={item.pregunta} header={item.pregunta}>
              <p className="leading-relaxed">{item.respuesta}</p>
            </AccordionTab>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
