/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      keyframes: {
        flip: {
          '0%, 100%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(180deg)' }
        }
      },
      animation: {
        'flip': 'flip 0.6s ease-in-out'
      }
    },
  },
  plugins: [],
}