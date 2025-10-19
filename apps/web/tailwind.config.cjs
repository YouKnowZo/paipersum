/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#0f4c81',
          green: '#2e7d32',
          yellow: '#f9a825',
          red: '#c62828'
        }
      }
    }
  },
  plugins: []
}
