// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <--- ¡Asegúrate de que esta línea esté correcta!
    // Si tienes componentes en otras carpetas fuera de src/pages o src/components,
    // asegúrate de que también estén incluidos aquí, por ejemplo:
    // "./src/layouts/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}