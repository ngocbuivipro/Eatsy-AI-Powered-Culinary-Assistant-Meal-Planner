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
        // Brand Palette
        primary:    "#526347",   // Deep Olive
        secondary:  "#D5E9C4",   // Light Moss
        background: "#F8FAF6",   // Ivory White
        accent:     "#EAFED9",   // Pale Leaf

        // Text
        "text-main":    "#2B352F", // Deep Forest
        "text-gray":    "#57615B", // Grey Green
        "text-light":   "#717171", // Generic Gray
        "text-placeholder": "#9CA3AF",

        // Semantic
        border:   "#E5E7EB",
        "input-bg": "#F9FAFB",
        error:    "#BD1919",
        success:  "#4CAF50",
      },
    },
  },
  plugins: [],
};