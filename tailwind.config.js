/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef2f3',
          100: '#fde6e8',
          200: '#fbd0d5',
          300: '#f7aab3',
          400: '#f27a8a',
          500: '#E63147',
          600: '#d01e35',
          700: '#ae1730',
          800: '#91162e',
          900: '#7c162c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}