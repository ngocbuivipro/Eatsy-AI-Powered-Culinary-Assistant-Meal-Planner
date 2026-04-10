/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,ts,tsx}",
    "./src/**/*.{js,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#526347",      // Deep Olive
        secondary: "#D5E9C4",    // Light Moss
        background: "#F8FAF6",   // Ivory White
        accent: "#EAFED9",       // Pale Leaf
        "eatsy-text": "#2B352F", // Deep Forest
        "eatsy-gray": "#57615B"  // Grey Green
      },
    },
  },
  plugins: [],
};