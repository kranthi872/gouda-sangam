/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#b45309",
        gold: "#d97706",
        dark: "#1c1917",
        surface: "#292524",
        card: "#3c3330",
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        body: ["Verdana", "sans-serif"],
      },
    },
  },
  plugins: [],
};
