/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f172a', // El azul muy oscuro de fondo
        surface: '#1e293b',    // El azul grisáceo de las tarjetas
        primary: '#3b82f6',    // El azul brillante de los botones
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: ["dark"], // Forzar tema oscuro
  }
}
