/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        shake: 'shake 0.3s ease-in-out',
      },
      boxShadow: {
        'inner-lg': 'inset 0 4px 10px -4px rgba(0, 0, 0, 0.1)',
      },
      keyframes: {
        shake: {
          '0%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(8px)' },
          '50%': { transform: 'translateX(-8px)' },
          '75%': { transform: 'translateX(8px)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
