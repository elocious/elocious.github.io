/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fbf6e9',
          100: '#f5e9c5',
          200: '#ecd491',
          300: '#e0bd5e',
          400: '#d4a82e',
          500: '#c2911a',
          600: '#a87514',
          700: '#855914',
          800: '#6e4817',
          900: '#5e3d17',
        },
        ink: {
          50: '#f5f6f8',
          100: '#e8eaef',
          200: '#cdd2db',
          300: '#a4adbf',
          400: '#7a8599',
          500: '#5b6678',
          600: '#475065',
          700: '#3a4254',
          800: '#1e2330',
          900: '#141821',
          950: '#0c0f16',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        shimmer: 'shimmer 1.5s infinite',
        float: 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        shimmer: { '0%': { backgroundPosition: '-1000px 0' }, '100%': { backgroundPosition: '1000px 0' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
      },
    },
  },
  plugins: [],
}
