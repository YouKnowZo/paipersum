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
        },
        ink: {
          900: '#0b1324',
          700: '#1f2937',
          500: '#4b5563',
          300: '#9ca3af'
        },
        paper: {
          0: '#ffffff',
          50: '#f9fafb',
          100: '#f3f4f6'
        },
        border: {
          200: '#e5e7eb'
        }
      },
      borderRadius: {
        xs: '6px',
        sm: '10px',
        md: '12px',
        lg: '16px',
        xl: '24px'
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,.06)',
        md: '0 6px 18px rgba(0,0,0,.1)',
        lg: '0 10px 30px rgba(0,0,0,.12)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Source Serif Pro', 'serif']
      }
    }
  },
  plugins: []
}