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
          suave: '#F5EEDE'
        },
        rosa: {
          DEFAULT: '#F8C8DC',
          intenso: '#E8A5C8'
        },
        marron: {
          DEFAULT: '#4A2E2B',
          oscuro: '#54332A'
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
