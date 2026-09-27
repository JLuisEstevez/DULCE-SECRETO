/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        // Paleta oficial de marca Dulce Secreto
        crema: {
          DEFAULT: '#FFFDD0',
          suave: '#f6eee0'
        },
        rosa: {
          DEFAULT: '#F8C8DC',
          intenso: '#e9a5c9'
        },
        marron: {
          DEFAULT: '#4A2E2B',
          oscuro: '#3d231d'
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Inter"', 'sans-serif']
      },
      maxWidth: {
        prose: '68ch'
      }
    }
  },
  plugins: []
}
