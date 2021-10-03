module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: "#47919B",
        secondary: "#334F59",
        greenOverlay: "#81ED99",
        richBlack: "#131523",
        charcoal: "#354052",
        steelTeal: "#47919b",
        maximumBlue: "#50b3c6",
        carribeanGreen: "#21d59b",
        lightGreen: "#81ed99",
        antiqueBrass: "#c09577",
        mustar: "#f6d250",
        candyPink: "#e56273",
        coolGrey: "#7e84a3",
        lavenderGray: "#d5d7e3",
        magnolia: "#e6e9f4",
        ghostWhite: "#f5f6fa",
        white: "#ffffff",
        mintCream: "#f7fff6",
        floralWhite: "#fffdf6",
      },
      fontFamily: {
        title: ["Libre Baskerville"],
        body: ["Poppins"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
