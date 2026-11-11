/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          yellow: '#FCEE0A',
          cyan: '#00F0FF',
          red: '#FF003C',
          pink: '#FF007F',
          dark: '#08080C',
          card: '#0E0E17',
          border: '#1E1E2F',
          muted: '#808294'
        }
      },
      fontFamily: {
        mono: ['"Share Tech Mono"', 'ui-monospace', 'monospace'],
        display: ['"Rajdhani"', '"Orbitron"', 'sans-serif'],
      },
      boxShadow: {
        'neon-yellow': '0 0 15px rgba(252, 238, 10, 0.4), 0 0 30px rgba(252, 238, 10, 0.2)',
        'neon-cyan': '0 0 15px rgba(0, 240, 255, 0.4), 0 0 30px rgba(0, 240, 255, 0.2)',
        'neon-red': '0 0 15px rgba(255, 0, 60, 0.4), 0 0 30px rgba(255, 0, 60, 0.2)',
      }
    },
  },
  plugins: [],
}

