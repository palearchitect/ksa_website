module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#f4f7fc',
          100: '#e8eff8',
          200: '#ccdcee',
          300: '#a0bfe0',
          400: '#6d9bcb',
          500: '#1b4d84',
          600: '#123966',
          700: '#0f294a',
          800: '#0a1d35',
          900: '#071324',
          950: '#030810',
        },
        orange: {
          50: '#fffaf5',
          100: '#ffeedd',
          200: '#ffd3b3',
          300: '#ffb27f',
          400: '#ff8a43',
          500: '#f96816',
          600: '#e05315',
          700: '#bb3f13',
          800: '#943114',
          900: '#772a15',
          950: '#411207',
        }
      }
    },
  },
  plugins: [],
};
