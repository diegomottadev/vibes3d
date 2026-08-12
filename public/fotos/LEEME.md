# Fotos de la Lámpara Geométrica

**Poné acá una foto por modelo, nombrada con el slug del modelo.** El sitio la detecta sola: si
existe el archivo, esa foto le gana a la `imagen_url` de la planilla. No hace falta editar la
planilla.

Nombres exactos (la extensión puede ser `.webp`, `.avif`, `.jpg`, `.jpeg` o `.png`):

| Archivo | Modelo | Estado |
| --- | --- | --- |
| `hexagonal-grande` | Pantalla Hexagonal Grande | cargada |
| `hexagonal-pequeno` | Pantalla Hexagonal Pequeño | **falta** |
| `triangulo-desplazado` | Pantalla Triángulo Desplazado | cargada |
| `voronoi` | Pantalla Voronoi | cargada |
| `diamante-grande` | Pantalla Diamante Grande | cargada |
| `diamante-horizontal` | Pantalla Diamante Horizontal | cargada |

Ojo: `hexagonal-pequeno` va **sin ñ y sin tilde**, porque así queda el slug en la URL.

Mientras falte una foto, ese modelo muestra el placeholder que trae la planilla. Cuando estén las
seis, se puede borrar el bloque `remotePatterns` de `next.config.mjs`, que existe solo para
permitir las URLs de Unsplash.

## Qué conviene fotografiar

Cada modelo se elige por cómo se ve encendido, así que la foto que más vende es
**la lámpara encendida en penumbra, con la trama de la pantalla bien legible**.

- Formato cuadrado (1:1), mínimo 1200 × 1200 px: la grilla y las páginas de detalle usan cuadrado.
- Misma distancia, mismo fondo y misma luz en las seis. La comparación entre modelos es el
  argumento de venta, y solo funciona si lo único que cambia es la trama.
- `next/image` se encarga de generar los tamaños y de servir AVIF o WebP según el navegador, así
  que conviene subir el original grande y no una versión ya achicada.
