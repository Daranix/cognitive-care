/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#F4C95D", // Mostaza suave (Botón principal)
          foreground: "#ffffff",
          50: "#fffaf0",
          100: "#fef4d8",
          200: "#fde5a8",
          300: "#fcd779",
          400: "#fac95a",
          500: "#f4c95d",
          600: "#e5b64d",
          700: "#d39f36",
          800: "#b27c25",
          900: "#8c631d",
          950: "#5a3d10",
        },
        secondary: {
          DEFAULT: "#A8D5BA", // Verde salvia (Botón alternativo, elementos suaves)
          foreground: "#ffffff",
          50: "#f2f9f5",
          100: "#e6f3eb",
          200: "#cde7d8",
          300: "#b5dcc6",
          400: "#9dd1b3",
          500: "#a8d5ba",
          600: "#8dc8a4",
          700: "#6cb687",
          800: "#4d936a",
          900: "#376f50",
          950: "#21413a",
        },
        neutral: {
          DEFAULT: "#F4F4F9", // Gris suave (Fondo)
          foreground: "#6C7A89", // Azul grisáceo para textos
          50: "#ffffff",
          100: "#f8f8fc",
          200: "#f0f1f7",
          300: "#e7e8f0",
          400: "#dee0e9",
          500: "#d4d7e1",
          600: "#c2c4cf",
          700: "#a7a8b2",
          800: "#8b8c92",
          900: "#6f7072",
          950: "#4e4f4f",
        },
        error: {
          DEFAULT: "#D9534F", // Rojo terracota (Errores)
          foreground: "#ffffff",
          50: "#fff1f0",
          100: "#ffe0de",
          200: "#ffbab6",
          300: "#f98b85",
          400: "#f16764",
          500: "#d9534f",
          600: "#be3e39",
          700: "#9e2d28",
          800: "#7d201c",
          900: "#641614",
          950: "#3e0d0c",
        }
      }
    },
  },
  plugins: [],
}

