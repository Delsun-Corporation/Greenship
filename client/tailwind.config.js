module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: "#47919B",
        secondary: "#334F59",
        greenOverlay: "#81ED99",
      },
      fontFamily: {
        'title': ['Libre Baskerville'],
        'body': ['Poppins'],
       },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
