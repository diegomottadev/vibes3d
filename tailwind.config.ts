import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // La paleta arranca del objeto: una lámpara encendida en una habitación oscura.
        noche: {
          DEFAULT: '#0B0B0C',
          suave: '#141416',
          borde: '#232326',
        },
        luz: {
          DEFAULT: '#F2B544',
          calida: '#FFD79A',
          tenue: '#8A6A2F',
        },
        hueso: '#EDEAE3',
        humo: '#8E8B85',
        // Los campos de formulario son más claros que la superficie donde apoyan: así se leen
        // como algo en lo que se escribe y no como un rectángulo dibujado.
        campo: {
          DEFAULT: '#1C1C20',
          borde: '#3A3A41',
        },
        // Para campos con error: un rojo cálido que convive con el ámbar sin gritar.
        alerta: '#E8654F',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        etiqueta: '0.18em',
      },
      maxWidth: {
        contenido: '76rem',
      },
      animation: {
        'brillo-lento': 'brillo 6s ease-in-out infinite',
      },
      keyframes: {
        brillo: {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '0.9' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
