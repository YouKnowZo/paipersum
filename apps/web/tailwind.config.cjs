/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#0d2746',
          blueDeep: '#08152c',
          blueMuted: '#1c3558',
          green: '#2fb5b4',
          yellow: '#f7b032',
          amber: '#f2910a',
          red: '#d86156'
        },
        ink: {
          900: '#0b1730',
          700: '#1f2944',
          600: '#3a465f',
          500: '#56607a',
          300: '#8a93aa'
        },
        paper: {
          0: '#ffffff',
          50: '#fdf7ef',
          100: '#f7efe2'
        },
        border: {
          200: '#e4d7c8'
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
