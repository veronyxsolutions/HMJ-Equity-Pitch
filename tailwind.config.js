/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        hmj: {
          forest: '#083819',
          cta: '#2E8748',
          dark: '#12381D',
          bronze: '#8F6544',
          navy: '#003153',
          cream: '#F6F3ED',
        },
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        geist: ['Geist', 'Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
