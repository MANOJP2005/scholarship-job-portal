/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fef9ec',
          100: '#fdf0c8',
          200: '#fbe08d',
          400: '#f7c948',
          500: '#f0b429',
          600: '#d99a0b',
          700: '#b4790a',
          900: '#7c4f10',
        },
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          500: '#334e68',
          600: '#243b53',
          700: '#1a2e44',
          800: '#102a43',
          900: '#0a1929',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
