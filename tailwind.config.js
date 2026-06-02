/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#eef1f5',
        bar: '#17324d',
        paper: '#fffdf8',
        ink: '#062642',
        navy: '#062642',
        'navy-dark': '#031729',
        accent: '#1d4f8f',
        gold: '#c7a24a',
        muted: '#667085',
      },
      fontFamily: {
        sans: ['Heebo', 'Arial', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
