/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'dark-transparent': '#00000022'
      }
    },
  },
  plugins: [],
  safelist: [
    'bg-purple-400',
    'bg-blue-400',
    'bg-green-400'
  ]
}
