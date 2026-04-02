/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F5F7F6',
          100: '#E6EBE9',
          200: '#C2D1CC',
          300: '#9FB7AF',
          400: '#7B9D93',
          500: '#588376',
          600: '#46695E',
          700: '#344F47',
          800: '#23342F',
          900: '#111A17',
        },
        surface: '#FAF9F5',
        organic: {
          cream: '#FAF9F5',
          stone: '#E8E6DF',
          sand: '#D4CDC4',
          clay: '#A3998D',
          charcoal: '#2C2B29'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

