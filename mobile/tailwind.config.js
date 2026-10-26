/** @type {import('tailwindcss').Config} */
module.exports = {
  // Every file that uses className must be listed here.
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Mockup palette: strictly black, white and neutral greys.
      colors: {
        grey: {
          100: '#F5F5F5',
          200: '#E5E5E5',
          500: '#8A8A8A',
        },
      },
      borderRadius: {
        xl: '12px',
      },
      // Each Metropolis weight is a separate font file, so each gets its own
      // family. Use font-metropolis-bold etc. instead of font-bold.
      fontFamily: {
        metropolis: ['Metropolis-Regular'],
        'metropolis-medium': ['Metropolis-Medium'],
        'metropolis-semibold': ['Metropolis-SemiBold'],
        'metropolis-bold': ['Metropolis-Bold'],
      },
    },
  },
  plugins: [],
};
