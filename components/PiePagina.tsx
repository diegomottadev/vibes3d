import { sitio } from '@/lib/site';
import { urlConsulta } from '@/lib/whatsapp';

export function PiePagina() {
  // Se calcula al generar la página. Como las páginas tienen `revalidate = 3600`, el año
  // se actualiza solo dentro de la hora siguiente al cambio de año, sin tocar nada.
  const anio = new Date().getFullYear();

  return (
    <footer className="border-t border-noche-borde">
      <div className="contenedor flex flex-col gap-8 py-14 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-display text-lg text-hueso">
            VIBES<span className="text-luz">.</span>
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <span className="etiqueta">Escribime</span>
          <a
            href={urlConsulta()}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-xl text-hueso transition-colors hover:text-luz"
          >
            {sitio.whatsappVisible}
          </a>
          {sitio.instagram ? (
            <a
              href={sitio.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="etiqueta transition-colors hover:text-hueso"
            >
              Instagram
            </a>
          ) : null}
        </div>
      </div>

      <div className="contenedor border-t border-noche-borde py-6">
        <p className="text-xs text-humo">
          {[
            sitio.marca,
            sitio.localidad.ciudad,
            sitio.localidad.provincia,
            'Argentina',
            anio,
          ].join(' · ')}
        </p>
      </div>
    </footer>
  );
}
