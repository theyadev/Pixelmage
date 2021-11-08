module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        black: {
          50: '#3C3C3C',
          100: '#383838',
          200: '#303030',
          300: '#292929',
          400: '#212121',
          500: '#1A1A1A',
          600: '#121212',
          700: '#0A0A0A',
          800: '#030303',
          900: '#000000'
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
