/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#1E3A5F',      // Primary navy blue
          orange: '#F5A623',    // Primary orange/yellow
          blue: '#2C5F8D',      // Secondary blue
          'navy-dark': '#152940', // Darker navy
          'orange-light': '#FDB44B', // Lighter orange
          green: '#2e7d32',
          red: '#c62828'
        },
        ink: {
          900: '#0F1419',       // Darkest text
          700: '#1E3A5F',       // Navy for text
          600: '#4b5563',
          500: '#6b7280',
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
      fontFamily: {
        ui: ['Inter', 'system-ui', 'sans-serif'],
        legal: ['Source Serif Pro', 'Georgia', 'serif']
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
      animation: {
        'blob': 'blob 7s infinite',
        'in': 'in 0.2s ease-out',
        'slide-in-from-top-4': 'slide-in-from-top-4 0.3s ease-out',
        'slide-in-from-bottom-4': 'slide-in-from-bottom-4 0.3s ease-out',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        'in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-from-top-4': {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-from-bottom-4': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    }
  },
  plugins: []
}
