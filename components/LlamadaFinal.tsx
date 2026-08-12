import { BotonPedido } from './BotonPedido';

export function LlamadaFinal() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="halo bottom-0 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 translate-y-1/3" />

      <div className="contenedor relative text-center">
        <h2 className="mx-auto max-w-2xl font-display text-4xl leading-tight tracking-tight text-hueso sm:text-5xl">
          ¿Ya sabés cuál querés?
        </h2>
        <p className="mx-auto mt-5 max-w-md leading-relaxed text-humo">
          Armá el pedido en treinta segundos y seguimos la conversación por WhatsApp.
        </p>

        <div className="mt-10 flex justify-center">
          <BotonPedido etiqueta="Elegir mi modelo" />
        </div>
      </div>
    </section>
  );
}
