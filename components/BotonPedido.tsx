import Link from 'next/link';

type Props = {
  etiqueta?: string;
  estilo?: 'principal' | 'secundario';
  className?: string;
  /** Adónde lleva. Por defecto, a la grilla de modelos. */
  href?: string;
};

const estilos = {
  principal: 'bg-luz text-noche hover:bg-luz-calida border border-luz',
  secundario: 'bg-transparent text-hueso border border-noche-borde hover:border-luz hover:text-luz',
} as const;

/**
 * Lleva a elegir un modelo. La compra no arranca acá: arranca en la página del modelo,
 * que es donde está la caja con el precio y la cantidad.
 */
export function BotonPedido({
  etiqueta = 'Elegir mi modelo',
  estilo = 'principal',
  className = '',
  href = '/#modelos',
}: Props) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 font-display text-xs uppercase tracking-etiqueta transition-colors ${estilos[estilo]} ${className}`}
    >
      {etiqueta}
    </Link>
  );
}
