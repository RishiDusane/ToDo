/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: '#17211d',
        moss: '#2f765c',
        coral: '#e47751',
      },
    },
  },
  plugins: [],
}
