/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'charcoal': '#3A3D51',
      },
    },
    maxWidth: {
      '2xl': '40rem',
      'xl': '36rem',
      'lg': '32rem',
      'md': '28rem',
      'sm': '24rem',
      'xs': '20rem',
      '2xs': '16rem',
      '3xs': '12rem',
      '4xs': '8rem',
      'min': 'min-content',
      'fit': 'fit-content',
      '1/4': '25%',
      '1/2': '50%',
    },
    maxHeight: {
      '2xl': '40rem',
      'xl': '36rem',
      'lg': '32rem',
      'md': '28rem',
      'sm': '24rem',
      'xs': '20rem',
      '2xs': '16rem',
      '3xs': '12rem'
    }
  },
  plugins: [],
}
