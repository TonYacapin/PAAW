module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      '2xs' : '320px',
      'xs' : '375px',

      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '769px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      colors: {
        darkgreen: "#1b5b40",
        darkergreen: "#123c29",
        white: "#fffafa",
        black: "#252525",
        pastelyellow: "#ffe459",
        darkerpastelyellow:"#e5cd50"
      },
    },
  },
  plugins: [],
};
