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
      },
      boxShadow: {
        'glass-pill': '0 8px 32px 0 rgba(0, 0, 0, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.2)',
        'glass-pill-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.12)',
        'glow-orange': '0 0 25px rgba(249, 104, 22, 0.35)',
        'glow-blue': '0 0 25px rgba(27, 77, 132, 0.35)',
        'bento-card': '0 10px 30px -10px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
      },
      letterSpacing: {
        'widest-swiss': '0.18em',
      }
    },
  },
  plugins: [],
};
