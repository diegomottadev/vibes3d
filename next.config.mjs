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
};

export default nextConfig;
