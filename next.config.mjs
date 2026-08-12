/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    /**
     * Sin optimizador a propósito.
     *
     * Las seis fotos ya son WebP de 1000×750 y pesan entre 12 y 41 KB: 112 KB las seis juntas.
     * Re-comprimirlas a AVIF en cada tamaño no ahorra nada y agrega el costo de procesarlas la
     * primera vez que alguien las pide, que es exactamente lo que se sentía como lentitud.
     * Servidas tal cual salen del disco, sin pasar por ningún proceso.
     *
     * Si alguna vez se suben fotos grandes (más de ~200 KB o más de 2000 px), conviene volver a
     * poner esto en false: ahí el optimizador sí paga lo que cuesta.
     */
    unoptimized: true,
    remotePatterns: [
      {
        // Respaldo: si a alguna variante le falta la foto local, la planilla trae una de Unsplash.
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  experimental: {
    /**
     * `lib/catalogo.ts` busca la foto de cada modelo con `fs.readdirSync('public/fotos')`.
     * En el build eso funciona, pero las páginas declaran `revalidate = 3600`: cada hora
     * el catálogo se vuelve a leer dentro de una función serverless, y ahí `public/` no
     * existe —Vercel sube esos archivos al CDN, no al bundle de la función—. El readdir
     * falla, `fotoLocal` devuelve null y las fotos reales se cambian solas por el
     * placeholder de Unsplash de la planilla, sin ningún error visible.
     *
     * Esto le pide al tracer que meta las fotos en el bundle de las rutas que leen el
     * catálogo. Si alguna vez el catálogo se lee desde una ruta nueva, hay que agregarla acá.
     */
    outputFileTracingIncludes: {
      '/': ['./public/fotos/**'],
      '/lampara/[slug]': ['./public/fotos/**'],
      '/sitemap.xml': ['./public/fotos/**'],
    },
  },
};

export default nextConfig;
